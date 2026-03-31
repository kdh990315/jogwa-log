import { NextResponse } from "next/server";

import {
  AUTH_ERROR_OAUTH_CALLBACK,
  AUTH_ERROR_QUERY_KEY,
  LOGIN_PATH,
} from "../../../lib/auth/constants";
import { createClient } from "../../../utils/supabase/server";

function redirectToNext(request: Request, next: string) {
  const requestUrl = new URL(request.url);
  const { origin } = requestUrl;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnvironment = process.env.NODE_ENV === "development";

  if (isLocalEnvironment) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { origin, searchParams } = requestUrl;
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectToNext(request, next);
    }
  }

  const loginUrl = new URL(LOGIN_PATH, origin);
  loginUrl.searchParams.set(AUTH_ERROR_QUERY_KEY, AUTH_ERROR_OAUTH_CALLBACK);

  return NextResponse.redirect(loginUrl);
}
