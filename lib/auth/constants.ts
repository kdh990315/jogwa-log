export const LOGIN_PATH = "/login";
export const AUTH_SUCCESS_PATH = "/dashboard";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const AUTH_ERROR_QUERY_KEY = "authError";
export const AUTH_ERROR_OAUTH_CALLBACK = "oauth_callback_failed";
export const AUTH_CALLBACK_ERROR_MESSAGE =
  "인증을 완료하지 못했습니다. 다시 시도해 주세요.";
export const LOGIN_ERROR_MESSAGE =
  "로그인을 진행하지 못했습니다. 다시 시도해 주세요.";
export const SIGN_OUT_ERROR_MESSAGE =
  "로그아웃을 완료하지 못했습니다. 다시 시도해 주세요.";

export type OAuthProvider = "google" | "kakao";
