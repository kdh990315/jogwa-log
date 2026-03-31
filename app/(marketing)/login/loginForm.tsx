"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import kakaoLogo from "../../../assets/images/kakako-logo.png";
import googleLogo from "../../../assets/images/google-logo.png";
import { createOAuthLoginUrl } from "../../../apis/auth";
import {
  AUTH_SUCCESS_PATH,
  LOGIN_ERROR_MESSAGE,
  type OAuthProvider,
} from "../../../lib/auth/constants";
import { useAuthStore } from "../../../stores/authStore";

interface LoginFormProps {
  initialErrorMessage?: string | null;
}

function getFriendlyAuthErrorMessage(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error("OAuth login failed", error);
  }

  return LOGIN_ERROR_MESSAGE;
}

export default function LoginForm({
  initialErrorMessage = null,
}: LoginFormProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);

  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialErrorMessage,
  );
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null,
  );

  useEffect(() => {
    if (session) {
      router.replace(AUTH_SUCCESS_PATH);
    }
  }, [router, session]);

  useEffect(() => {
    setErrorMessage(initialErrorMessage);
  }, [initialErrorMessage]);

  async function handleOAuthLogin(provider: OAuthProvider) {
    setPendingProvider(provider);
    setErrorMessage(null);

    try {
      const loginUrl = await createOAuthLoginUrl(provider);
      window.location.assign(loginUrl);
    } catch (error) {
      setErrorMessage(getFriendlyAuthErrorMessage(error));
      setPendingProvider(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5">
        <button
          type="button"
          onClick={() => void handleOAuthLogin("google")}
          disabled={pendingProvider !== null}
          className="relative inline-flex w-full min-h-[52px] cursor-pointer appearance-none items-center justify-center rounded-[16px] border border-[#dadbdf] bg-white px-4 py-3 text-[16px] leading-[19px] font-bold text-[#1b1c1f] outline-none transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute left-4 inline-flex h-5 w-5 items-center justify-center">
            <Image
              src={googleLogo}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </span>
          <p className="font-bold ">
            {pendingProvider === "google"
              ? "구글 로그인 이동 중..."
              : "구글로 시작하기"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => void handleOAuthLogin("kakao")}
          disabled={pendingProvider !== null}
          className="relative inline-flex w-full min-h-[52px] cursor-pointer appearance-none items-center justify-center rounded-[16px] border border-[#dadbdf] bg-white px-4 py-3 text-[16px] leading-[19px] font-bold text-[#1b1c1f] outline-none transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute left-4 inline-flex h-5 w-5 items-center justify-center">
            <Image
              src={kakaoLogo}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </span>
          <p className="font-bold ">
            {pendingProvider === "kakao"
              ? "카카오 로그인 이동 중..."
              : "카카오로 시작하기"}
          </p>
        </button>
      </div>

      <div
        aria-live="polite"
        className="min-h-6 text-sm leading-6 text-[color:var(--text-muted)]"
      >
        {errorMessage ? (
          <p className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[#b91c1c]">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
