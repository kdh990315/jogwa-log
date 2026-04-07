begin;

create index if not exists fish_field_type_name_idx
  on public.fish (field_type_id, name);

create index if not exists fishing_logs_target_fish_field_type_idx
  on public.fishing_logs (target_fish_id, field_type_id);

commit;
