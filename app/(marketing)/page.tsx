import HomePageShell from "./home-page-shell";

export default function HomePage() {
  return (
    <HomePageShell>
      <main className="flex flex-1 px-[var(--page-padding-inline)] py-[var(--page-padding-block)]">
        <section className="mx-auto flex min-h-full w-full max-w-[var(--page-max-width)] items-center">
          <div className="grid w-full gap-[var(--section-gap)] lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-[var(--shadow-card)] backdrop-blur-[18px] sm:p-10">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--brand)]">
                Jogwa-log
              </p>
              <h1 className="max-w-[10ch] text-[clamp(2.75rem,6vw,5.4rem)] leading-[0.92] font-semibold tracking-[-0.04em] text-[color:var(--text)]">
                조황을 쌓아두는 현장형 낚시 로그
              </h1>
              <p className="mt-6 max-w-[54ch] text-[1rem] leading-7 text-[color:var(--text-muted)] sm:text-[1.05rem]">
                조과 기록은 단순한 메모가 아니라 다음 출조의 근거가 되어야
                합니다. 조과로그는 포인트, 수온, 조류, 채비, 사진, 메모를 한
                흐름으로 정리하는 제품이라는 인상이 먼저 보여야 합니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["포인트", "조류", "수온", "채비", "미끼", "사진 기록"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-medium text-[color:var(--text)] shadow-[var(--shadow-soft)]"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </article>

            <aside className="flex flex-col gap-[var(--section-gap)]">
              <section className="rounded-[var(--radius-panel)] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                  Design Direction
                </p>
                <p className="mt-4 text-lg leading-8 font-medium text-[color:var(--text)]">
                  바다와 기록물 사이의 톤이 필요합니다. 과한 SaaS
                  glassmorphism보다, 현장감 있는 색과 또렷한 정보 밀도를 우선해야
                  합니다.
                </p>
              </section>

              <section className="rounded-[var(--radius-panel)] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[color:var(--text)]">
                    기본 레이아웃 기준
                  </h2>
                  <span className="rounded-full bg-[color:var(--brand-strong)] px-3 py-1 text-xs font-semibold text-white">
                    Mobile First
                  </span>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-[color:var(--text-muted)]">
                  <li>정보 위계가 바로 보여야 합니다.</li>
                  <li>카드는 장식보다 읽기 쉬운 밀도를 우선합니다.</li>
                  <li>배경은 분위기를 만들되 콘텐츠를 이기면 안 됩니다.</li>
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </HomePageShell>
  );
}
