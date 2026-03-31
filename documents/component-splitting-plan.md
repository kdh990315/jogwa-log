# 컴포넌트 분해 계획

작성일: 2026-04-01  
작업 브랜치: `feat/post-fish-log`

## 1. 이 문서를 먼저 남기는 이유

지금 단계에서 가장 비싼 건 새 화면을 더 붙이는 일이 아니라, 너무 긴 컴포넌트 파일을 계속 방치해서 이후 수정 비용을 키우는 일이다.

이 방식이 최선인 이유는 아래와 같다.

- 현재 몇몇 화면은 "길다" 수준을 넘어 한 파일이 여러 책임을 동시에 들고 있다.
- 이런 상태에서는 작은 수정도 파일 전체를 다시 읽어야 해서 작업 속도가 급격히 떨어진다.
- 특히 차트, 테이블, 모달, 카드가 섞인 화면은 줄 수보다 "어디를 열어야 하는지 바로 보이지 않는 것"이 더 큰 문제다.
- 따라서 지금 필요한 건 무작정 잘게 쪼개는 작업이 아니라, `컨테이너 + 독립 섹션 + feature-local helper` 구조를 먼저 고정하는 것이다.

결론:  
이번 리팩터링의 목표는 `150줄 이하 강박`이 아니라, `수정 포인트가 즉시 보이는 구조`를 만드는 것이다.  
150줄 기준은 결과적으로 자연스럽게 맞춰지게 하고, 억지 분리는 피한다.

## 2. 현재 확인한 문제 파일

2026-04-01 기준 실측 줄 수는 아래와 같다.

- `components/locationStats/locationStatsView.tsx`: 871줄
- `components/dashboard/registerLog/registerLogDialog.tsx`: 617줄
- `components/dashboard/dashboardView.tsx`: 520줄
- `components/logs/logsView.tsx`: 504줄
- `components/dashboard/patternAnalysisCard.tsx`: 485줄

문제는 단순히 길다는 점이 아니다.

- 화면 조립
- 로컬 상태
- 파생 데이터 계산
- 큰 섹션 UI
- 작은 하위 뷰 프리미티브
- 상수 / helper

위 항목들이 한 파일 안에 동시에 들어 있다.

즉, 지금 병목은 `코드가 많다`가 아니라 `경계가 무너져 있다`는 데 있다.

## 3. 분해 원칙

### 3-1. 최상위 파일은 컨테이너만 맡는다

최상위 화면 파일은 아래 역할만 가져간다.

- 서버 또는 상위에서 받은 props 수신
- 로컬 상태 선언
- 파생 데이터 계산
- 큰 섹션 컴포넌트 조립

반대로 아래 내용은 가능한 한 최상위 파일에서 내린다.

- 테이블 마크업 전체
- 카드 내부 상세 레이아웃
- 차트 단위 구현
- 반복되는 row/card item 렌더링
- 스타일 helper

### 3-2. 분해 기준은 재사용성이 아니라 화면 의미 단위다

아래처럼 화면에서 독립된 덩어리로 인식되는 단위가 우선 분해 대상이다.

- 상단 헤더
- 요약 카드 묶음
- 필터 영역
- 테이블 영역
- 차트 카드
- 모달 step
- 상세 카드 1개

즉, `Text`, `Label`, `SectionTitle` 같은 작은 공용 atom을 먼저 만드는 방식은 현재 요구사항에 맞지 않는다.

### 3-3. `components/ui`로 올리지 말고 feature 가까이에 둔다

현재 단계에서 공용화보다 중요한 건 책임이 명확한가다.

원칙:

- 해당 화면에서만 쓰는 컴포넌트는 feature 폴더 아래에 둔다.
- 여러 화면에서 의미까지 동일하게 재사용될 때만 `components/ui` 승격을 검토한다.

예:

- `logsTable.tsx`는 `components/logs` 아래
- `locationCard.tsx`는 `components/locationStats` 아래
- `registerCatchInfoStep.tsx`는 `components/dashboard/registerLog` 아래

### 3-4. 먼저 상수와 helper를 빼고, 그 다음 JSX를 뺀다

리팩터링 순서는 아래가 가장 안전하다.

1. `constants`, `helpers`, `types` 분리
2. 큰 섹션 컴포넌트 분리
3. 정말 큰 섹션 안에서만 작은 하위 컴포넌트 분리

이 순서를 지키면 state 소유권이 덜 흔들리고, diff도 관리하기 쉽다.

### 3-5. state는 가능한 한 한 단계 위에 둔다

상태를 여러 파일로 흩뿌리면 줄 수는 줄어도 추적이 더 어려워진다.

기준:

- 필터 / 정렬 / 탭 선택처럼 화면 전체에 영향을 주는 state는 컨테이너에 둔다.
- 아코디언 열림 여부처럼 카드 내부에서만 쓰는 state는 해당 카드 내부에 둔다.
- 모달 step과 formState는 모달 컨테이너에 둔다.

## 4. 하지 말아야 할 분해

아래 방식은 현재 프로젝트에서 오히려 유지보수성을 떨어뜨린다.

- 줄 수만 줄이려고 30~50줄짜리 atom 파일을 과도하게 만드는 방식
- feature 전용 컴포넌트를 섣불리 `components/ui`로 올리는 방식
- 버튼 하나, badge 하나를 이유 없이 공용화하는 방식
- state와 렌더링 경계를 같이 자르지 않고 JSX만 외부로 빼는 방식
- props drilling이 심해질 정도로 무리하게 쪼개는 방식

이번 리팩터링의 핵심은 `작게 쪼개기`가 아니라 `찾기 쉽게 나누기`다.

## 5. 파일별 목표 구조

### 5-1. `components/logs/logsView.tsx`

현재 역할:

- 상단 헤더
- 요약 카드
- 검색 / 필터 / 정렬 state
- 필터 영역
- 테이블
- row 렌더링
- 아이콘 helper

목표 구조:

- `logsView.tsx`
  - state
  - 파생 데이터 계산
  - 섹션 조립
- `logsHeader.tsx`
- `logsSummaryCards.tsx`
- `logsFilters.tsx`
- `logsTable.tsx`
- `logsTableRow.tsx`
- `logs.constants.ts`
- `logs.helpers.ts`

핵심 판단:

- 이 파일은 `row`와 `table` 분리만 해도 읽기 난도가 크게 내려간다.
- 필터 UI도 독립 섹션이므로 별도 파일로 두는 편이 수정 동선이 좋다.
- 어종 색상, 채비 색상, 전체 옵션 상수는 JSX 파일 밖으로 빼는 게 맞다.

### 5-2. `components/locationStats/locationStatsView.tsx`

현재 역할:

- 상단 헤더
- 연도 필터 / 정렬 state
- KPI 카드
- 종합 비교 차트
- 랭킹 카드
- 포인트 상세 카드 목록
- 포인트 카드 내부 미니 차트
- 카드 내부 조건 아이템
- helper 함수

목표 구조:

- `locationStatsView.tsx`
  - state
  - 정렬 결과 계산
  - 섹션 조립
- `locationStatsHeader.tsx`
- `locationStatsMetrics.tsx`
- `comparisonChartCard.tsx`
- `rankingCard.tsx`
- `locationCard.tsx`
- `compactStat.tsx`
- `speciesDonutChart.tsx`
- `monthlyMiniChart.tsx`
- `conditionItem.tsx`
- `locationStats.helpers.ts`
- `locationStats.constants.ts`
- `locationStats.types.ts`

핵심 판단:

- 현재 가장 먼저 구조 정리가 필요한 파일이다.
- 특히 `LocationCard`가 독립 컴포넌트로 빠져야 포인트 카드 수정이 쉬워진다.
- helper 함수와 className 계산 함수는 JSX와 분리하는 것이 맞다.

### 5-3. `components/dashboard/dashboardView.tsx`

현재 역할:

- 대시보드 상단
- KPI 카드
- 캘린더 카드
- 포인트 성과 미리보기 카드
- 최근 기록 카드

목표 구조:

- `dashboardView.tsx`
  - 섹션 조립만 담당
- `metricCard.tsx`
- `calendarCard.tsx`
- `locationStatsPreviewCard.tsx`
- `recentLogsCard.tsx`

핵심 판단:

- 이 파일은 상태가 거의 없어서 분리가 가장 쉽다.
- 조립 파일 성격이 강하므로 최종적으로 100줄 안팎까지 내리기 좋다.
- `dashboardView.tsx`는 페이지 assembler처럼 유지하는 편이 가장 읽기 좋다.

### 5-4. `components/dashboard/patternAnalysisCard.tsx`

현재 역할:

- 월별 조과 추이 카드
- 패턴 분석 탭 카드
- 물때 성과 카드
- 탭 버튼
- 탭 내부 차트 섹션
- tooltip style, viz 색상 상수

목표 구조:

- `monthlyTrendCard.tsx`
- `patternAnalysisCard.tsx`
- `tideAnalysisCard.tsx`
- `patternTabButton.tsx`
- `speciesPatternSection.tsx`
- `timePatternSection.tsx`
- `locationPatternSection.tsx`
- `patternAnalysis.shared.ts`

핵심 판단:

- 실제로는 한 파일 안에 카드 3개가 섞여 있는 상태다.
- 이미 내부 함수들이 독립 섹션 형태를 갖고 있어서 파일 분리 난도가 낮다.
- chart 스타일 상수와 formatter는 shared 파일로 분리하는 것이 자연스럽다.

### 5-5. `components/dashboard/registerLog/registerLogDialog.tsx`

현재 역할:

- 다이얼로그 open/close
- step state
- formState
- body scroll lock
- escape 처리
- 트리거 버튼
- 모달 셸
- progress bar
- step 1
- step 2
- step 3
- footer 액션

목표 구조:

- `registerLogDialog.tsx`
  - `isOpen`, `registerStep`, `fishingType`, `formState`
  - open/close 로직
  - step 이동 제어
- `registerLogTriggerButton.tsx`
- `registerLogModalShell.tsx`
- `registerLogProgress.tsx`
- `registerFishingTypeStep.tsx`
- `registerCatchInfoStep.tsx`
- `registerLocationStep.tsx`
- `registerLogFooter.tsx`
- `registerLog.constants.ts`
- `registerLog.types.ts`
- `registerLogFormState.ts`

핵심 판단:

- 이 파일은 긴 컴포넌트가 아니라 `3단계 모달 state machine`에 가깝다.
- 따라서 input 단위가 아니라 `step 단위`로 자르는 것이 맞다.
- 이 파일을 먼저 정리하면 이후 기능 추가 속도가 가장 크게 올라간다.

## 6. 추천 작업 순서

우선순위는 아래가 좋다.

1. `components/dashboard/registerLog/registerLogDialog.tsx`
2. `components/locationStats/locationStatsView.tsx`
3. `components/logs/logsView.tsx`
4. `components/dashboard/patternAnalysisCard.tsx`
5. `components/dashboard/dashboardView.tsx`

이 순서가 좋은 이유는 아래와 같다.

- `registerLogDialog`는 상태와 JSX가 가장 강하게 얽혀 있어 체감 개선폭이 크다.
- `locationStatsView`는 가장 길고 가장 많은 책임을 갖고 있다.
- `logsView`는 리스트 화면이라 분해 기준이 명확하다.
- `patternAnalysisCard`는 이미 분해 가능한 내부 구조가 갖춰져 있다.
- `dashboardView`는 마지막에 정리해도 위험이 낮다.

## 7. 리팩터링 체크리스트

각 파일을 분해할 때 아래 순서를 기본값으로 삼는다.

1. 현재 파일에서 state와 파생 데이터 계산 위치를 먼저 확인한다.
2. `constants`, `helpers`, `types`를 먼저 분리한다.
3. 화면에서 독립된 큰 섹션부터 분리한다.
4. row, card item, mini chart처럼 반복 요소를 분리한다.
5. 최상위 파일에는 state와 섹션 조립만 남긴다.
6. 분리 후에도 props 이름이 모호해지지 않았는지 확인한다.
7. `pnpm lint`, `pnpm typecheck`로 깨진 경계가 없는지 확인한다.

## 8. 최종 원칙 요약

앞으로의 분해 기준은 아래 한 줄로 정리한다.

`최상위 파일은 상태와 조립만 맡고, 화면에서 보이는 의미 단위 섹션을 feature 가까이에 둔다.`

이 기준을 지키면 줄 수는 자연스럽게 줄고, 무엇보다도 "어디를 고치면 되는지"가 빠르게 보이게 된다.
