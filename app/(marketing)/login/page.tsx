import { Suspense } from "react";
import type { Metadata } from "next";
import { Fish } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AUTH_ERROR_OAUTH_CALLBACK,
  AUTH_CALLBACK_ERROR_MESSAGE,
  AUTH_SUCCESS_PATH,
} from "../../../lib/auth/constants";
import { createClient } from "@jogwa-log/data-access/supabase/server";
import LoginForm from "./loginForm";

export const metadata: Metadata = {
  title: "로그인 | Jogwa-log",
  description: "구글 또는 카카오 계정으로 Jogwa-log에 로그인하세요.",
};

interface LoginPageProps {
  searchParams?: Promise<{
    authError?: string;
  }>;
}

function getAuthErrorMessage(authError?: string) {
  switch (authError) {
    case AUTH_ERROR_OAUTH_CALLBACK:
      return AUTH_CALLBACK_ERROR_MESSAGE;
    default:
      return null;
  }
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect(AUTH_SUCCESS_PATH);
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialErrorMessage = getAuthErrorMessage(
    resolvedSearchParams?.authError,
  );

  return (
    <main className="min-h-screen bg-white ">
      <header className="border-b border-b-gray-100">
        <div className="mx-auto flex w-full max-w-[1280px] items-center py-3 sm:py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold text-[color:var(--text)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[color:var(--brand)] text-white shadow-[var(--shadow-soft)]">
              <Fish className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-[-0.02em]">
              Jogwa-log
            </span>
          </Link>
        </div>
      </header>

      <section className="mx-auto min-h-[calc(100vh-9rem)] w-full max-w-[32rem] pt-10">
        <div className="w-full text-center">
          <div className="mt-2">
            <p className="mt-8 text-[1.45rem] leading-[1.45] font-semibold tracking-[-0.03em] text-[color:var(--text)]">
              조과 기록을 더 간편하게,
            </p>
            <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]">
              카카오 또는 구글 계정으로 바로 로그인하고,
              <br />
              조과 기록과 메모를 한곳에서 이어가세요.
            </p>
          </div>

          <div className="mt-20">
            <LoginForm initialErrorMessage={initialErrorMessage} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={null}>
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}
