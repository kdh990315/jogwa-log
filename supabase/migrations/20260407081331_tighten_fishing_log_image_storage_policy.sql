begin;

create or replace function public.user_owns_fishing_log(p_log_id text)
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_log_id bigint;
begin
  if p_log_id is null or p_log_id !~ '^[0-9]+$' then
    return false;
  end if;

  v_log_id := p_log_id::bigint;

  return exists (
    select 1
    from public.fishing_logs
    where id = v_log_id
      and user_id = (select auth.uid())
  );
end;
$$;

revoke all on function public.user_owns_fishing_log(text) from public;
revoke all on function public.user_owns_fishing_log(text) from anon;
grant execute on function public.user_owns_fishing_log(text) to authenticated;

drop policy if exists "Users can upload own fishing log storage objects"
on storage.objects;

create policy "Users can upload own fishing log storage objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'fishing-log-images'
  and (storage.foldername(name))[1] = (select auth.jwt() ->> 'sub')
  and (select public.user_owns_fishing_log((storage.foldername(name))[2]))
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
);

commit;
