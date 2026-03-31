import { Suspense, type ReactNode } from "react";
import { createClient } from "@jogwa-log/data-access/supabase/server";
import { redirect } from "next/navigation";

import { LOGIN_PATH } from "../../lib/auth/constants";
import AppShell from "../../components/layout/appShell";
import { getFish } from "./cachedData";

interface AppLayoutProps {
  children: ReactNode;
}

async function AuthenticatedAppLayout({ children }: AppLayoutProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(LOGIN_PATH);
  }

  await getFish();

  return <AppShell>{children}</AppShell>;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Suspense fallback={null}>
      <AuthenticatedAppLayout>{children}</AuthenticatedAppLayout>
    </Suspense>
  );
}
