import { DashboardView } from "../../../components/dashboard/dashboardView";
import {
  getDashboardData,
  getFishingMode,
} from "../../../lib/mock/dashboardData";
import { getFish } from "../cachedData";

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

  const data = await getFish();

  console.log(data);

  return <DashboardView activeMode={activeMode} data={dashboardData} />;
}
