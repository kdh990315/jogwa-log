begin;

alter function public.create_fishing_log_from_form(
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
) rename to create_fishing_log;

revoke all on function public.create_fishing_log(
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

revoke all on function public.create_fishing_log(
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
) from anon;

grant execute on function public.create_fishing_log(
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

comment on function public.create_fishing_log(
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
