import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import {
  AUTH_CALLBACK_PATH,
  AUTH_SUCCESS_PATH,
  type OAuthProvider,
} from "../lib/auth/constants";
import { createClient } from "../utils/supabase/client";

function getAuthRedirectUrl() {
  const redirectUrl = new URL(AUTH_CALLBACK_PATH, window.location.origin);
  redirectUrl.searchParams.set("next", AUTH_SUCCESS_PATH);

  return redirectUrl.toString();
}

export async function getAuthSession() {
  return createClient().auth.getSession();
}

export function subscribeToAuthState(
  onSessionChange: (session: Session | null) => void,
) {
  const {
    data: { subscription },
  } = createClient().auth.onAuthStateChange(
    (_event: AuthChangeEvent, session: Session | null) => {
      onSessionChange(session);
    },
  );

  return subscription;
}

export async function createOAuthLoginUrl(provider: OAuthProvider) {
  const { data, error } = await createClient().auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getAuthRedirectUrl(),
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error(
      "로그인 이동 경로를 만들지 못했습니다. 다시 시도해 주세요.",
    );
  }

  return data.url;
}

export async function signOut() {
  const { error } = await createClient().auth.signOut();

  if (error) {
    throw error;
  }
}
