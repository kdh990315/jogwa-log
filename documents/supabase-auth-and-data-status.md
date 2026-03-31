# Supabase 인증 및 데이터 설계 현황

작성일: 2026-03-26  
최종 업데이트: 2026-03-31  
작업 브랜치: `feat/post-fish-log`

## 1. 이 문서를 먼저 남기는 이유

지금 단계에서 가장 비싼 건 화면 몇 개를 더 붙이는 일이 아니라, 인증 경계와 사용자 데이터 구조를 잘못 고정하는 일이다.

이 방식이 최선인 이유는 아래와 같다.

- 이 프로젝트는 `Next.js App Router + Supabase + RLS` 전제가 강하다.
- 인증을 클라이언트 상태만으로 처리하면 나중에 보호된 데이터 조회 구조를 다시 뜯어고쳐야 한다.
- 사용자별 조과 데이터는 스키마를 처음 잘못 잡으면 이후 통계/검색/확장 비용이 급격히 커진다.
- 따라서 지금까지 결정한 인증 구조, provider 범위, 데이터 테이블 초안을 한 번 문서로 고정해두는 편이 이후 작업 속도와 품질 모두에 유리하다.

## 2. 현재 상태 요약

현재까지 정리된 상태는 아래와 같다.

- `2026-03-31` 현재 세션에서 Supabase MCP 연결 및 `public` 스키마 조회 확인 완료
- `@supabase/ssr` 기반 SSR 쿠키 세션 구조로 마이그레이션 완료
- 로그인 provider는 `Google`, `Kakao` 2개만 유지
- `Naver` 버튼은 한 차례 검토했지만 현재는 제거
- 앱 영역은 서버에서 인증 여부를 확인한 뒤 진입 허용
- 클라이언트 전역 사용자 상태는 `zustand`로 관리
- 로그인 API 호출은 `/apis/auth.ts`로 분리
- 메인 페이지(`/`)에서도 공용 헤더를 재사용하도록 정리

### 2-1. 2026-03-31 기준 MCP 실측 결과

이번 세션에서 Supabase MCP로 직접 확인한 값은 아래와 같다.

- 프로젝트 URL: `https://qimzdvtaicijykefpnpi.supabase.co`
- `public.field_types`: `rows = 2`, `RLS enabled`
- `public.fish`: `rows = 73`, `RLS enabled`
- `public.profiles`: `rows = 0`, `RLS enabled`

로컬 repo 기준으로는 아래도 그대로다.

- `supabase/migrations` 디렉터리가 없다.
- `database.types.ts` 같은 Supabase generated type 파일이 없다.

## 3. 현재 인증 아키텍처

### 3-1. 기본 원칙

현재 구조의 핵심은 아래 두 가지다.

- 세션의 진실된 원본은 Supabase에 둔다.
- UI 편의 상태만 `zustand` store에 반영한다.

즉, `zustand`는 보안 경계가 아니라 렌더링 편의 계층이다.

### 3-2. 클라이언트 / 서버 경계

현재 Supabase 접근 계층은 아래처럼 나뉜다.

- 브라우저 클라이언트: `utils/supabase/client.ts`
- 서버 클라이언트: `utils/supabase/server.ts`
- 세션 갱신 proxy: `utils/supabase/proxy.ts`, 루트 `proxy.ts`
- 공용 인증 API: `apis/auth.ts`

환경 변수는 아래 public 값만 사용한다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- fallback: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

현재 구조에서는 `service_role`을 프론트엔드에 쓰지 않는다.

### 3-3. 로그인 플로우

현재 로그인 흐름은 아래 순서다.

1. `/login`에서 provider 버튼 클릭
2. `apis/auth.ts`의 `createOAuthLoginUrl(provider)` 호출
3. `supabase.auth.signInWithOAuth()`로 provider 이동
4. provider 인증 후 `/auth/callback`으로 복귀
5. `app/auth/callback/route.ts`에서 `exchangeCodeForSession(code)` 실행
6. 세션 쿠키를 만든 뒤 `/dashboard`로 이동

현재 provider 타입은 아래 둘만 허용한다.

- `google`
- `kakao`

정의 위치:

- `lib/auth/constants.ts`

### 3-4. 서버 보호 구조

현재 앱 영역 보호는 서버에서 수행한다.

- `proxy.ts`: 요청마다 세션 쿠키 갱신
- `app/(app)/layout.tsx`: `supabase.auth.getClaims()`로 인증 여부 확인
- 인증 정보가 없으면 `/login`으로 `redirect()`

이 구조가 중요한 이유는 아래와 같다.

- proxy는 세션 갱신과 빠른 전처리 역할만 맡는다.
- 실제 보호 판단은 서버 레이아웃에서 다시 수행한다.
- 따라서 클라이언트에서 store를 조작한다고 해서 보호된 route에 접근할 수는 없다.

### 3-5. 클라이언트 전역 상태

사용자 상태는 `stores/auth-store.ts`에서 관리한다.

저장 값:

- `isLoading`
- `session`
- `user`

액션:

- `clearSession`
- `hydrateSession`
- `refreshSession`
- `setSession`

동기화 컴포넌트:

- `components/auth/auth-session-sync.tsx`

이 컴포넌트는 앱 시작 시 현재 세션을 hydrate하고, `onAuthStateChange` 구독으로 세션 변경을 store에 반영한다.

### 3-6. 현재 UI가 실제로 사용하는 사용자 데이터

카카오/구글 로그인 후 현재 UI가 실제로 소비하는 값은 매우 제한적이다.

- `user.user_metadata.full_name`
- `user.user_metadata.name`
- `user.user_metadata.nickname`
- `user.email`

즉, 현재는 `세션 + 이름 계열 메타데이터 + 이메일`만 UI 의미값으로 쓰고 있다.  
`avatar`, `phone`, 기타 provider 전용 필드는 현재 코드에서 소비하지 않는다.

또한 `2026-03-31` MCP 확인 기준 `public.profiles` 테이블은 존재하지만 `rows = 0` 상태다.  
즉, 현재 인증 UI와 앱 진입 보호는 `profiles` 적재를 전제로 하지 않고, Supabase 세션과 user metadata 중심으로 동작한다고 보는 편이 맞다.

## 4. Provider 결정 사항

### 4-1. 현재 유지 provider

현재 로그인 화면에서 유지하는 provider는 아래 둘이다.

- `Google`
- `Kakao`

이 둘은 현재 구조에서 바로 OAuth 로그인 흐름에 연결된다.

### 4-2. Naver를 제거한 이유

`Naver` 버튼은 한 번 UI에 추가했지만 다시 제거했다.

이 판단의 이유는 아래와 같다.

- 2026-03-26 기준 Supabase 공식 Social Login 문서의 기본 지원 목록에 `Naver`가 보이지 않는다.
- 따라서 `provider: "naver"`를 직접 넣으면 깨진 버튼이 될 가능성이 높다.
- 현재 단계에서 가장 좋은 선택은 “보여주기용 버튼”이 아니라 “실제로 동작하는 provider만 남기는 것”이다.

정리:

- 현재 프로젝트의 공식 지원 provider는 `Google`, `Kakao`
- `Naver`가 필요하면 이후 `Custom OAuth Provider` 또는 별도 인증 브리지 전략을 검토

## 5. 메인 페이지와 로그인 페이지 UI 상태

### 5-1. 메인 페이지(`/`)

현재 메인 페이지는 공용 `Header`를 재사용한다.

- 메인 페이지에서도 헤더 노출
- 다크모드 토글 유지
- 다크모드 버튼 옆에 대시보드 이동 버튼 추가
- 메인 페이지에서는 모바일 메뉴 버튼과 사용자 요약은 숨김

이 구조가 좋은 이유는 `Header`를 복제하지 않고, 옵션 prop만 확장해 재사용했기 때문이다.

### 5-2. 로그인 페이지(`/login`)

현재 로그인 페이지는 아래 상태다.

- `Google`, `Kakao` 소셜 로그인 버튼 제공
- SSR 쿠키 세션 구조를 설명하는 문구 포함
- provider setup 안내 포함
- 이미 로그인된 세션이면 `/dashboard`로 즉시 이동
- OAuth callback 실패 시 에러 메시지 노출

## 6. 보안 판단 정리

현재 기준으로 보안적으로 좋아진 점과 아직 남은 점을 나누면 아래와 같다.

### 6-1. 좋아진 점

- 클라이언트 중심 인증 상태에서 SSR 쿠키 세션 구조로 이동
- 앱 영역 진입을 서버에서 검증
- proxy와 서버 레이아웃이 같은 세션 체계를 공유
- 로그인 관련 Supabase 호출이 한 파일(`/apis/auth.ts`)로 정리되어 관리 포인트가 명확함

### 6-2. 아직 남은 점

- 실제 사용자별 조과 데이터 테이블과 RLS 정책은 아직 만들지 않았다.
- 현재 `/dashboard`, `/logs`, `/location-stats`는 여전히 mock 성격 데이터가 섞여 있다.
- `public.profiles` 테이블은 이미 존재하지만 현재 `rows = 0` 상태라서, 로그인 후 프로필 동기화 전략은 아직 실데이터 기준으로 고정된 상태가 아니다.
- 따라서 “인증 구조”는 잡혔지만 “실제 사용자 데이터 보호”는 테이블/RLS까지 가야 완성된다.

### 6-3. 꼭 기억할 기준

- `zustand` store는 보안 장치가 아니다.
- proxy만으로 인증을 끝내면 안 된다.
- 최종 보호 판단은 서버에서 계속 수행해야 한다.
- 사용자 데이터 접근은 결국 Supabase RLS가 기준이 되어야 한다.

## 7. 현재 알려진 개발 경고

이건 치명적 오류는 아니지만, 이후 정리 대상이다.

- Recharts `ResponsiveContainer`가 부모 크기를 읽지 못해 `width(-1)`, `height(-1)` 경고 발생
- `html { scroll-behavior: smooth; }` 사용 중인데 `<html data-scroll-behavior="smooth">`가 없어 Next.js 경고 발생

정리 우선순위는 인증/DB 연결보다 낮지만, 대시보드 품질 측면에서 나중에 손봐야 한다.

## 8. 사용자 조과 데이터용 테이블 설계 초안

현재까지 본 프로젝트 구조 기준으로는 “출조 기록 본체”와 “기록에 속한 어종 결과”를 나누는 방식이 가장 적절하다.

다만 이 섹션은 아직 실제 DB에 반영된 최종 스키마가 아니라, 현재 UI / mock 데이터 / 인증 구조를 같이 보고 정리한 설계 초안이다.

즉, 아래 내용은 “이미 구현된 사실”이 아니라 “다음 구현 전에 고정해야 할 기준”으로 보는 편이 맞다.

- 현재 repo에는 이 설계를 반영한 migration SQL이 없다.
- 현재 repo에는 Supabase에서 생성한 `database.types.ts`도 없다.
- 따라서 실제 구현 단계에서는 migration, RLS, generated type 생성까지 한 묶음으로 가야 한다.

### 8-1. 이미 존재하는 public 테이블

현재 `2026-03-31` MCP 기준으로 확인된 `public` 테이블은 아래 3개다.

- `public.field_types` (`rows = 2`, `RLS enabled`)
- `public.fish` (`rows = 73`, `RLS enabled`)
- `public.profiles` (`rows = 0`, `RLS enabled`)

역할:

- `field_types`: 바다/민물 같은 필드 유형 마스터
- `fish`: 어종 마스터
- `profiles`: `auth.users.id`와 연결되는 사용자 프로필 확장 테이블

#### 현재 실제 스키마

`public.field_types`

- `id bigint generated by default as identity primary key`
- `name varchar null`

`public.fish`

- `id bigint generated by default as identity primary key`
- `name varchar null`
- `field_type_id bigint null references public.field_types(id)`

`public.profiles`

- `id uuid primary key references auth.users(id)`
- `nickname text null`
- `birth_year integer null`
- `main_genre text null`
- `created_at timestamptz default timezone('utc', now())`

즉, 현재 실제 DB는 아래 권장안보다 더 얇은 상태다.  
특히 `field_types`, `fish`에는 `code`, `aliases`, `is_active`, `created_at`, `updated_at` 같은 운영용 컬럼이 아직 없다.

#### 권장 보강 방향

`public.field_types`

- `id bigint generated always as identity primary key`
- `code text not null unique`
- `name text not null unique`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

`public.fish`

- `id bigint generated always as identity primary key`
- `field_type_id bigint not null references public.field_types(id)`
- `name text not null`
- `aliases text[] null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

권장 제약:

- `unique (field_type_id, name)`

#### 초기 seed 권장안

`public.field_types`

- `sea` / `바다`
- `freshwater` / `민물`

`public.fish`

- 바다: `광어`, `우럭`, `쭈꾸미`, `갑오징어`, `노래미`, `농어`
- 민물: `배스`, `쏘가리`, `붕어`, `잉어`

이 정도는 최소로 들어가 있어야 현재 mock 데이터와 등록 UI를 무리 없이 실제 데이터로 바꿀 수 있다.

### 8-2. 새로 만드는 핵심 테이블

#### `public.fishing_logs`

출조 자체를 저장하는 본체 테이블.

추천 컬럼:

- `id bigint generated always as identity primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `field_type_id bigint not null references public.field_types(id)`
- `occurred_at timestamptz not null`
- `target_fish_id bigint null references public.fish(id)`
- `custom_target_fish_name text null`
- `location_name text not null`
- `latitude numeric(9,6) null`
- `longitude numeric(9,6) null`
- `weather text null`
- `water_temperature_c numeric(4,1) null`
- `tide text null`
- `method text null`
- `memo text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `public.fishing_log_catches`

한 출조 안에서 잡은 어종 결과를 저장하는 테이블.

추천 컬럼:

- `id bigint generated always as identity primary key`
- `log_id bigint not null references public.fishing_logs(id) on delete cascade`
- `fish_id bigint null references public.fish(id)`
- `custom_fish_name text null`
- `catch_count integer not null default 0 check (catch_count >= 0)`
- `max_size_cm numeric(5,1) null check (max_size_cm is null or max_size_cm >= 0)`
- `is_primary boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

권장 체크 제약:

- `check (target_fish_id is not null or custom_target_fish_name is not null)` on `fishing_logs`
- `check (fish_id is not null or custom_fish_name is not null)`

#### 현재 등록 UI와 컬럼 매핑

현재 등록 다이얼로그 입력값을 기준으로 보면 매핑은 아래처럼 잡는 것이 가장 자연스럽다.

- `fishingType` -> `fishing_logs.field_type_id`
- `date` + `time` -> `fishing_logs.occurred_at`
- `species` -> `fishing_logs.target_fish_id` 또는 `fishing_logs.custom_target_fish_name`
- `catchCount` -> `fishing_log_catches.catch_count`
- `maxSize` -> `fishing_log_catches.max_size_cm`
- `tide` -> `fishing_logs.tide`
- `weather` -> `fishing_logs.weather`
- `waterTemperature` -> `fishing_logs.water_temperature_c`
- `locationQuery` -> `fishing_logs.location_name`
- 지도 포인트 선택 값 -> `fishing_logs.latitude`, `fishing_logs.longitude`
- `memo` -> `fishing_logs.memo`

#### 현재 UI 기준으로 추가로 고정할 구현 규칙

현재 UI는 “출조 대상 어종” 1개만 입력받지만, 실제 도메인은 복수 어종 결과가 가능하다.

따라서 초기 구현 규칙은 아래처럼 두는 편이 가장 안전하다.

- 출조의 “대상 어종”은 `fishing_logs`에 저장한다.
- 실제 잡은 결과는 `fishing_log_catches`에 저장한다.
- `catch_count > 0`이면 `fishing_log_catches`에 1행을 만든다.
- `catch_count = 0`이면 catch 행을 만들지 않고, 대상 어종만 `fishing_logs`에 남긴다.
- 이후 UI가 복수 어종 입력을 지원하면 `fishing_log_catches` 다건 insert로 확장한다.

이 규칙이 필요한 이유는 현재 UI가 “대상 어종”을 입력받고, mock 데이터에는 `count = 0`인 꽝 기록도 있기 때문이다.

### 8-3. 왜 두 테이블로 나누는가

이 구조가 맞는 이유는 아래와 같다.

- 날짜, 장소, 날씨, 수온, 메모는 “출조”에 붙는 값이다.
- 대상 어종은 잡았는지 여부와 별개로 “출조 의도”에 붙는 값이다.
- 마릿수와 최대어 크기는 “어종 결과”에 붙는 값이다.
- 현재 UI는 어종 1개처럼 보이더라도, 실제 도메인에서는 한 출조에 복수 어종이 자연스럽다.
- 처음부터 분리해두면 이후 통계, 검색, 다중 어종 지원으로 확장하기 쉽다.

### 8-4. 지금은 만들지 않아도 되는 것

초기 단계 기준에서는 아래는 과한 추상화다.

- `locations` 마스터 테이블
- `weather` 마스터 테이블
- `tide` 마스터 테이블
- `method` 마스터 테이블
- 별도 `user_fish` 테이블

현재는 문자열/좌표 컬럼으로 충분하다.

다만 이것은 “평생 문자열로 가자”는 뜻은 아니다.

- 초기에 변경 비용이 큰 것은 사용자 소유 데이터 구조다.
- 반면 `weather`, `tide`, `method`, `location`은 실제 사용 패턴을 본 뒤 마스터화해도 늦지 않다.

### 8-5. RLS 기준

RLS는 아래처럼 가는 것이 기본 전제다.

- `field_types`, `fish`: 일반 앱 사용자에게는 `select`만 허용하고 쓰기는 막는다.
- `fishing_logs`: `user_id = auth.uid()`
- `fishing_log_catches`: `log_id`를 통해 상위 `fishing_logs.user_id` 소유권 확인

즉, catch 테이블에 `user_id`를 중복 저장하지 않아도 된다.

중요한 점은 `fish`가 사용자별 데이터가 아니라 앱 공통 마스터라는 점이다.

- 일반 사용자 조과 등록 플로우에서 `fish`에 직접 insert 하게 만들지 않는다.
- 어종 마스터 등록은 admin SQL / dashboard / 별도 운영 도구에서만 수행하는 편이 안전하다.

### 8-6. 인덱스 권장안

최소 권장 인덱스:

- `fishing_logs (user_id, occurred_at desc)`
- `fishing_logs (field_type_id, occurred_at desc)`
- `fishing_logs (target_fish_id)`
- `fishing_log_catches (log_id)`
- `fishing_log_catches (fish_id)`

선택:

- `unique (log_id, fish_id)`

단, 한 출조에서 같은 어종을 한 행으로만 집계할 경우에만 둔다.

#### 현재 코드 기준으로 아직 남아 있는 결정 사항

문서만 보고 구현에 들어가면 헷갈릴 수 있는 포인트를 미리 적어두면 아래와 같다.

- 현재 등록 UI에는 `method` 입력이 없지만, 로그 목록과 mock 데이터는 `method`를 사용한다.
- 따라서 스키마에서는 `method`를 nullable로 두고, UI에는 곧 입력 필드를 추가하는 편이 맞다.
- 현재 등록 UI의 어종 입력은 자유 텍스트 + 빠른 선택 칩 구조다.
- 따라서 초기에는 `fish_id` 강제 단일 선택보다 `master 참조 + custom text fallback` 구조가 현실적이다.
- `weather`, `tide` 옵션은 현재 UI와 mock 데이터가 완전히 일치하지 않는다.
- 따라서 초기에 별도 마스터 테이블로 고정하지 말고 문자열 컬럼으로 남겨두는 편이 안전하다.

## 9. 다음 작업 우선순위

현재 문서 기준으로 다음 순서는 아래가 가장 자연스럽다.

1. `field_types`, `fish` 실제 스키마 보강 범위 확정 및 `profiles` 사용 여부 정리
2. `fishing_logs`, `fishing_log_catches` migration 작성
3. RLS 정책 작성
4. Supabase generated type 생성 및 프로젝트에 반영
5. 등록 다이얼로그를 실제 Supabase insert로 연결
6. 등록 UI에 `method` 입력과 필수값 validation 추가
7. `/dashboard`, `/logs`, `/location-stats`에서 mock 데이터를 실제 쿼리로 교체
8. 통계 쿼리와 인덱스 검토

즉, 다음 핵심 단계는 “인증”이 아니라 “실제 사용자 데이터 적재와 조회”다.

## 10. 참고 문서

인증 구조와 provider 판단에 참고한 공식 문서:

- Supabase SSR 가이드: https://supabase.com/docs/guides/auth/server-side
- Supabase SSR client 생성: https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
- Supabase SSR advanced guide: https://supabase.com/docs/guides/auth/server-side/advanced-guide
- Supabase Social Login: https://supabase.com/docs/guides/auth/social-login
- Supabase Custom OAuth Providers: https://supabase.com/docs/guides/auth/custom-oauth-providers
- Supabase user-owned table 권장: https://supabase.com/docs/guides/auth/managing-user-data
- Supabase API/RLS 보안: https://supabase.com/docs/guides/api/securing-your-api
- Next.js Proxy 문서: https://nextjs.org/docs/app/getting-started/proxy

## 11. 검증 메모

지금까지 주요 인증 구조 변경 시점에는 아래 검증을 통과했다.

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

최근 provider/UI 조정 단계에서는 구조 변경이 없어서 `lint`, `typecheck` 중심으로 확인했다.
