# `use cache` 정리: 공식 문서로 이해하고, 조과로그에 적용해보기

이 글은 Next.js 공식 문서와 TanStack Query 공식 문서를 기준으로 정리한 초안이다.

- `use cache`에 대한 사실 설명은 Next.js 공식 문서를 기준으로 했다.
- TanStack Query에 대한 설명은 TanStack Query 공식 문서를 기준으로 했다.
- 조과로그 프로젝트에 대한 평가는 현재 구조에 공식 문서 내용을 적용한 해석이다.

## 한 줄 요약

`use cache`는 Next.js의 `Cache Components` 기능으로, `route`, `React component`, `async function`의 결과를 서버 기준으로 캐시할 수 있게 해준다. 다만 이 기능은 "클라이언트 모달 안에서 필요한 작은 reference data를 편하게 재사용하는 도구"라기보다, 서버 렌더링 경계에서 `정적 셸에 안전하게 포함할 수 있는 데이터`를 다룰 때 더 잘 맞는다.

## 1. `use cache`란 무엇인가

Next.js 공식 문서에 따르면 `use cache`는 route, React component, function을 cacheable 하게 표시하는 directive다. 파일 상단, 컴포넌트 내부, 함수 내부에 둘 수 있고, 반환 결과를 캐시한다.

공식 문서 기준 핵심 포인트는 이렇다.

- `use cache`는 `Cache Components` 기능이다.
- 사용하려면 `next.config.ts`에서 `cacheComponents: true`가 켜져 있어야 한다.
- 파일 레벨에 둘 수도 있고, 함수/컴포넌트 레벨에 inline으로 둘 수도 있다.
- 파일 레벨에 둘 경우 해당 파일의 function export는 모두 `async`여야 한다.

조과로그 프로젝트의 현재 설정도 이 전제는 만족한다.

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: true,
  transpilePackages: ["@jogwa-log/data-access"],
};

export default nextConfig;
```

## 2. `use cache`는 어떻게 캐시 키를 만드는가

공식 문서에 따르면 캐시 키는 대략 아래 요소로 만들어진다.

- Build ID
- Function ID
- 직렬화 가능한 인자
- 개발 환경에서는 HMR refresh hash

여기서 중요한 점은 "함수 인자만" 키에 들어가는 게 아니라, 바깥 스코프에서 캡처한 값도 자동으로 key의 일부가 된다는 점이다. 즉 `use cache`는 "같은 함수 이름이면 같은 캐시"가 아니라, 실제 실행 문맥을 기준으로 안전하게 키를 만든다.

## 3. 직렬화 규칙과 제약

공식 문서에서 특히 강조하는 부분이 직렬화다.

- 캐시 함수의 인자와 반환값은 직렬화 가능해야 한다.
- 인자와 반환값은 서로 다른 직렬화 규칙을 사용한다.
- plain object, array, primitive, Date, Map, Set 같은 값은 지원된다.
- class instance, 함수 호출 결과를 직접 들여다보는 패턴, `WeakMap`, `URL` 인스턴스 같은 값은 지원되지 않는다.

예외도 있다.

- `children`
- Server Action

같이 "그 값을 내부에서 해석하지 않고 pass-through만 하는 경우"는 허용된다.

즉 `use cache`는 "아무 값이나 받아서 편하게 캐시"하는 도구가 아니라, 직렬화 규칙 안에서 안전하게 동작하도록 설계된 기능이다.

## 4. `use cache` 안에서 바로 쓰면 안 되는 것들

공식 문서 기준으로 `cookies()`, `headers()`, `searchParams` 같은 request-time API는 cached scope 안에서 직접 읽을 수 없다. 이런 값은 cached scope 바깥에서 먼저 읽고, 인자로 넘기는 방식이 권장된다.

이 규칙은 꽤 중요하다. `use cache`는 "요청마다 달라지는 정보"와 "캐시 가능한 계산"을 같은 함수 안에 섞지 않도록 강하게 밀어붙인다.

## 5. 런타임 캐시는 어떻게 동작하나

Next.js 공식 문서는 `use cache`가 기본적으로 "uncached data를 static shell 안에 포함시키기 위한 기능"이라고 설명한다. 동시에 런타임에서도 in-memory LRU 방식으로 캐시할 수 있다고 말한다.

여기서 실무적으로 중요한 주의점이 나온다.

- 서버리스 환경에서는 캐시 엔트리가 요청 간에 유지되지 않을 수 있다.
- self-hosted 환경에서는 요청 간에 유지될 수 있다.
- in-memory 캐시가 부족하면 `use cache: remote`를 고려할 수 있지만, 네트워크 왕복과 플랫폼 비용이 든다.

즉 `use cache`는 "무조건 강한 전역 캐시"가 아니라, 배포 환경에 따라 runtime 효율이 달라질 수 있다.

## 6. `cacheLife`와 `cacheTag`

`use cache`를 실무에서 쓰려면 보통 `cacheLife`, `cacheTag`를 같이 본다.

### `cacheLife`

공식 문서 기준 `cacheLife`는 캐시 수명을 지정하는 함수다. `use cache` scope 안에서 사용해야 하며, 기본 profile 대신 `seconds`, `minutes`, `hours`, `days`, `weeks`, `max` 같은 profile을 명시적으로 적는 것이 권장된다.

Next.js 공식 문서의 preset profile 기준은 대략 이렇다.

| profile | stale | revalidate | expire |
| --- | --- | --- | --- |
| `default` | 5분 | 15분 | never |
| `seconds` | 30초 | 1초 | 1분 |
| `minutes` | 5분 | 1분 | 1시간 |
| `hours` | 5분 | 1시간 | 1일 |
| `days` | 5분 | 1일 | 1주 |
| `weeks` | 5분 | 1주 | 30일 |
| `max` | 5분 | 30일 | 1년 |

공식 문서에는 `stale` 값이 client cache에도 영향을 준다고 나와 있다. 이 stale 시간은 `x-nextjs-stale-time` 헤더를 통해 전달되며, client router가 재검증 시점을 판단하는 데 사용된다. 또 time-based expiration에는 최소 30초가 강제된다.

### `cacheTag`

공식 문서 기준 `cacheTag`는 cached data에 tag를 붙여서 이후 `revalidateTag`나 `updateTag` 같은 API로 더 정밀하게 무효화할 수 있게 해준다.

이 방식은 path 단위 재검증보다 훨씬 정밀하다. Next.js 공식 문서도 가능하면 `revalidatePath`보다 `revalidateTag`/`updateTag` 같은 tag 기반 무효화를 선호하라고 안내한다.

## 7. 공식 문서 기준으로 보면 `use cache`는 언제 잘 맞나

Next.js 공식 문서의 설명을 현재 프로젝트 문맥으로 번역하면, `use cache`는 아래 상황에서 잘 맞는다.

- 서버에서 읽어온 reference data를 여러 route에서 공통으로 재사용할 때
- 정적 셸이나 PPR 응답에 포함해도 되는 데이터일 때
- 자주 바뀌지 않아서 `hours`, `days`, `weeks` 같은 수명으로 설명 가능한 데이터일 때
- mutation 이후 `cacheTag` 기반으로 다시 무효화할 계획이 있을 때

예를 들면 조과로그 프로젝트에서는 아래 같은 함수가 `use cache` 자체로는 꽤 자연스럽다.

```ts
// app/(app)/cachedData.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getFieldTypes() {
  "use cache";

  cacheLife("hours");
  cacheTag("initial-data");
  cacheTag("field-types");

  // Supabase에서 reference data 조회
}
```

이 코드는 "잘 안 바뀌는 reference data를 서버에서 읽고, 태그로 무효화 가능하게 만든다"는 점에서 공식 문서가 말하는 전형적인 `use cache` 패턴과 잘 맞는다.

## 8. 그런데 왜 조과로그의 현재 케이스에는 잘 맞지 않았나

여기서부터는 공식 문서 내용을 현재 구조에 적용한 해석이다.

문제는 `getFieldTypes()` 함수 자체가 아니라, **그 데이터를 어디서 소비하느냐**였다.

조과로그에서 `field_types`, `fish` 데이터가 필요했던 곳은 `RegisterLogDialog`였다. 그런데 이 컴포넌트는 `use client` 기반의 모달이고, 사용자가 버튼을 눌렀을 때만 열리는 상호작용 UI다.

우리가 한때 시도했던 구조는 이런 식이었다.

```tsx
// components/registerLog/registerLogLauncher.tsx
import { getFieldTypes, getFish } from "@/app/(app)/cachedData";
import { RegisterLogDialog } from "./registerLogDialog";

export async function RegisterLogLauncher(props: {
  triggerClassName?: string;
  triggerLabel?: string;
}) {
  const [fieldTypes, fishRows] = await Promise.all([getFieldTypes(), getFish()]);

  return <RegisterLogDialog {...props} fieldTypes={fieldTypes} fishRows={fishRows} />;
}
```

이 구조는 "동작하게 만들 수는 있지만", 지금 프로젝트의 목적에는 잘 맞지 않았다.

이유는 명확했다.

- 데이터가 필요한 곳은 `client modal`인데 캐시는 `server function`에 걸려 있었다.
- 결국 `props drilling`을 하거나 `RegisterLogLauncher` 같은 서버 래퍼를 추가해야 했다.
- `logs`처럼 원래 client tree였던 화면은 서버/클라이언트 경계를 다시 나눠야 했다.
- 데이터 자체는 작고 단순한 reference data인데, 그것을 위해 불필요한 레이어가 생겼다.

즉 이 케이스에서의 병목은 "캐시가 없어서 느리다"가 아니라, **데이터의 소유권은 클라이언트에 있는데 캐시 전략은 서버에만 걸려 있었다**는 점이었다.

Next.js 공식 문서가 `use cache`를 주로 static shell과 server rendering 문맥에서 설명하는 이유가 바로 여기서 드러난다. `use cache`는 훌륭한 서버 캐시 도구지만, 클라이언트 모달이 소유하는 작은 reference data 문제를 가장 단순하게 풀어주는 도구는 아니다.

## 9. 그래서 현재 프로젝트에서는 어떤 구조가 더 나은가

이 부분은 프로젝트 상황에 대한 판단이다.

현재 조과로그는 이미 Supabase에 `field_types`, `fish` 테이블이 만들어져 있다. 이 말은 곧 "이 값을 코드 상수로만 볼 것인가"보다, **DB를 source of truth로 유지할 것인가**가 더 중요한 판단 기준이라는 뜻이다.

이 상황에서는 하드코딩보다 아래 구조가 더 낫다.

- `app/(app)/layout.tsx`에서 서버 fetch 1회
- `ReferenceDataProvider`에 초기값 주입
- 클라이언트에서는 Zustand selector로 `fieldTypes`, `fishRows` 소비

이 구조의 장점은 분명하다.

- props drilling이 없다.
- 서버 래퍼가 필요 없다.
- DB를 source of truth로 유지할 수 있다.
- route 전환 중에는 store를 계속 재사용할 수 있다.
- `TanStack Query`를 도입하기 전까지는 가장 단순한 전역 읽기 구조다.

즉 현재 프로젝트의 결론은, "정교한 서버 캐시"보다 **DB 원본 + layout 초기 주입 + 가벼운 클라이언트 store**가 더 잘 맞는다는 쪽이다.

## 10. 그렇다면 나중에는 무엇이 더 맞을까

여기서 대안으로 자연스럽게 나오는 것이 TanStack Query 같은 클라이언트 캐시다.

TanStack Query 공식 문서는 이 라이브러리를 "server state를 fetching, caching, synchronizing, updating 하는 도구"로 설명한다. 또 기본적으로 query data를 stale로 취급하고, `staleTime`, `gcTime`, background refetch, invalidation 같은 전략을 제공한다.

이 특성은 아래 케이스에 특히 잘 맞는다.

- 데이터가 `client component` 안에서 직접 필요할 때
- 모달이 열릴 때 lazy fetch하고 싶을 때
- 여러 클라이언트 컴포넌트가 같은 서버 상태를 공유할 때
- mutation 이후 invalidate가 필요할 때
- props drilling 없이 query key 기준으로 재사용하고 싶을 때

조과로그 프로젝트에서 reference data가 커지고, 아래 항목이 붙기 시작하면 TanStack Query 도입 명분이 강해진다.

- `field_types`
- `fish`
- 장소 검색 결과
- 사용자 조과 목록의 클라이언트 갱신
- 등록/수정/삭제 후 invalidate

그때는 예를 들어 이런 형태가 더 자연스럽다.

```tsx
// 예시 코드: 아직 프로젝트에는 TanStack Query가 설치되어 있지 않다.
import { useQuery } from "@tanstack/react-query";

import { getFieldTypes } from "@jogwa-log/data-access/api/referenceData/fieldTypes";
import { getFish } from "@jogwa-log/data-access/api/referenceData/fish";
import { createClient } from "@jogwa-log/data-access/supabase/browser";

export function useRegisterReferenceData() {
  return useQuery({
    queryKey: ["register-log", "reference-data"],
    queryFn: async () => {
      const client = createClient();
      const [fieldTypes, fishRows] = await Promise.all([
        getFieldTypes(client),
        getFish(client),
      ]);

      return { fieldTypes, fishRows };
    },
    staleTime: 1000 * 60 * 60,
  });
}
```

이 구조의 장점은 분명하다.

- `RegisterLogDialog`가 필요한 데이터를 자기 위치에서 직접 가져올 수 있다.
- props drilling이 사라진다.
- `queryKey` 단위로 클라이언트 캐시가 재사용된다.
- 나중에 mutation이 붙어도 invalidate 흐름을 유지할 수 있다.

정리하면:

- DB를 source of truth로 유지해야 한다면, 지금은 `layout + Zustand`가 더 단순하다.
- 실제 reference data 조회와 mutation 흐름이 더 복잡해지면 TanStack Query가 더 맞다.
- `use cache`는 그 중간 지대의 만능 해답은 아니다.

## 11. 실무 판단 기준

아래 질문으로 판단하면 된다.

### `use cache`가 맞는 경우

- 이 데이터는 서버에서 읽는 것이 자연스러운가?
- 정적 셸이나 PPR에 포함되어도 되는가?
- route/component/function 단위로 캐시 수명을 설명할 수 있는가?
- tag 기반 재검증 전략을 쓰고 싶은가?

### 하드코딩이 맞는 경우

- 아직 MVP 단계인가?
- 옵션 수가 적고 거의 안 바뀌는가?
- 서버 경계를 추가하는 비용이 더 큰가?

### TanStack Query가 맞는 경우

- 데이터 소비자가 클라이언트 컴포넌트인가?
- props drilling이 이미 불편한가?
- mutation 이후 invalidate가 필요한가?
- 같은 서버 상태를 여러 client component에서 공유하는가?

## 12. 내가 이 글을 쓰고 나서 실제로 내린 결론

조과로그 프로젝트에서는 `use cache` 자체가 틀린 선택은 아니었다. 서버 reference data를 읽는 함수에만 한정하면 공식 문서 기준으로도 자연스러운 선택이었다.

하지만 `RegisterLogDialog`처럼 클라이언트 모달이 주도하는 UI에 그 전략을 그대로 밀어 넣는 순간, 캐시보다 레이어가 더 큰 문제가 되었다.

그리고 현재는 이미 Supabase에 reference data 테이블이 있기 때문에, 하드코딩보다는 `layout + Zustand 초기 주입`이 더 일관된 선택이 된다.

그래서 현재 프로젝트의 결론은 이렇게 정리할 수 있다.

- 지금 단계: DB 원본 + layout 초기 주입 + Zustand
- 다음 단계: 클라이언트 reference data와 mutation이 늘어나면 TanStack Query
- `use cache`: 서버 렌더링 경계에 맞는 데이터에만 제한적으로 사용

이게 지금 구조에서 가장 비용이 낮고, 나중에 바꾸기도 가장 쉽다.

## 참고 자료

### Next.js 공식 문서

- [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [`cacheLife`](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- [Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)

### TanStack Query 공식 문서

- [TanStack Query Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
