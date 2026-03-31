import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { LOGIN_PATH } from "../../lib/auth/constants";
import { createClient } from "../../utils/supabase/server";
import AppShell from "../../components/layout/AppShell";

interface AppLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(LOGIN_PATH);
  }

  return <AppShell>{children}</AppShell>;
}
