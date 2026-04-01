begin;

create or replace function public.create_fishing_log_from_form(
  p_field_type_id bigint,
  p_species_name text,
  p_date date,
  p_time time without time zone,
  p_location_name text,
  p_weather text,
  p_catch_count integer default 0,
  p_max_size_cm numeric default null,
  p_tide text default null,
  p_water_temperature_c numeric default null,
  p_latitude double precision default null,
  p_longitude double precision default null,
  p_memo text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_target_fish public.fish%rowtype;
  v_log_id bigint;
  v_occurred_at timestamptz;
  v_species_name text := nullif(btrim(p_species_name), '');
  v_location_name text := nullif(btrim(p_location_name), '');
  v_weather text := nullif(btrim(p_weather), '');
  v_tide text := nullif(btrim(p_tide), '');
  v_memo text := nullif(btrim(p_memo), '');
  v_max_size_cm numeric := case
    when p_catch_count > 0 then p_max_size_cm
    else null
  end;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  if p_field_type_id is null then
    raise exception 'FIELD_TYPE_ID_REQUIRED' using errcode = 'P0001';
  end if;

  if v_species_name is null then
    raise exception 'SPECIES_REQUIRED' using errcode = 'P0001';
  end if;

  if v_location_name is null then
    raise exception 'LOCATION_NAME_REQUIRED' using errcode = 'P0001';
  end if;

  if v_weather is null then
    raise exception 'WEATHER_REQUIRED' using errcode = 'P0001';
  end if;

  if p_catch_count is null or p_catch_count < 0 then
    raise exception 'INVALID_CATCH_COUNT' using errcode = 'P0001';
  end if;

  if p_catch_count = 0 and p_max_size_cm is not null then
    raise exception 'MAX_SIZE_REQUIRES_CATCH' using errcode = 'P0001';
  end if;

  if p_max_size_cm is not null and p_max_size_cm < 0 then
    raise exception 'INVALID_MAX_SIZE' using errcode = 'P0001';
  end if;

  select *
  into v_target_fish
  from public.fish
  where field_type_id = p_field_type_id
    and name = v_species_name
  limit 1;

  v_occurred_at := make_timestamptz(
    extract(year from p_date)::integer,
    extract(month from p_date)::integer,
    extract(day from p_date)::integer,
    extract(hour from p_time)::integer,
    extract(minute from p_time)::integer,
    floor(extract(second from p_time))::integer,
    'Asia/Seoul'
  );

  insert into public.fishing_logs (
    user_id,
    field_type_id,
    target_fish_id,
    custom_target_fish_name,
    location_name,
    latitude,
    longitude,
    memo,
    occurred_at,
    tide,
    water_temperature_c,
    weather
  )
  values (
    v_user_id,
    p_field_type_id,
    v_target_fish.id,
    case when v_target_fish.id is null then v_species_name else null end,
    v_location_name,
    p_latitude,
    p_longitude,
    v_memo,
    v_occurred_at,
    v_tide,
    p_water_temperature_c,
    v_weather
  )
  returning id into v_log_id;

  if p_catch_count > 0 then
    insert into public.fishing_log_catches (
      log_id,
      fish_id,
      custom_fish_name,
      catch_count,
      max_size_cm
    )
    values (
      v_log_id,
      v_target_fish.id,
      case when v_target_fish.id is null then v_species_name else null end,
      p_catch_count,
      v_max_size_cm
    );
  end if;

  return v_log_id;
end;
$$;

revoke all on function public.create_fishing_log_from_form(
  bigint,
  text,
  date,
  time without time zone,
  text,
  text,
  integer,
  numeric,
  text,
  numeric,
  double precision,
  double precision,
  text
) from public;

grant execute on function public.create_fishing_log_from_form(
  bigint,
  text,
  date,
  time without time zone,
  text,
  text,
  integer,
  numeric,
  text,
  numeric,
  double precision,
  double precision,
  text
) to authenticated;

comment on function public.create_fishing_log_from_form(
  bigint,
  text,
  date,
  time without time zone,
  text,
  text,
  integer,
  numeric,
  text,
  numeric,
  double precision,
  double precision,
  text
) is '현재 조과 등록 폼 입력 shape에 맞춰 낚시 로그와 조과 정보를 함께 생성합니다.';

commit;
