import { DashboardView } from "./_components/dashboardView";
import { getDashboardData, getFishingMode } from "@/lib/mock/dashboardData";

interface DashboardPageProps {
  searchParams?: Promise<{
    mode?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeMode = getFishingMode(resolvedSearchParams?.mode);
  const dashboardData = getDashboardData(activeMode);

  return <DashboardView activeMode={activeMode} data={dashboardData} />;
}
