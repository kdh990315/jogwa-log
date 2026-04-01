import { Suspense, type ReactNode } from "react";
import { getFieldTypes } from "@jogwa-log/data-access/api/referenceData/fieldTypes";
import { getFish } from "@jogwa-log/data-access/api/referenceData/fish";
import { createClient } from "@jogwa-log/data-access/supabase/server";
import Script from "next/script";
import { redirect } from "next/navigation";

import { ReferenceDataProvider } from "@/components/providers/referenceDataProvider";

import { LOGIN_PATH } from "../../lib/auth/constants";
import AppShell from "../../components/layout/appShell";

interface AppLayoutProps {
  children: ReactNode;
}

async function AuthenticatedAppLayout({ children }: AppLayoutProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(LOGIN_PATH);
  }

  const [fieldTypes, fishRows] = await Promise.all([
    getFieldTypes(supabase),
    getFish(supabase),
  ]);

  return (
    <ReferenceDataProvider initialState={{ fieldTypes, fishRows }}>
      <>
        <Script
          id="kakao-map-sdk"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`}
          strategy="afterInteractive"
        />
        <AppShell>{children}</AppShell>
      </>
    </ReferenceDataProvider>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Suspense fallback={null}>
      <AuthenticatedAppLayout>{children}</AuthenticatedAppLayout>
    </Suspense>
  );
}
