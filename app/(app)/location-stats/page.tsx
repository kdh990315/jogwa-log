import { LocationStatsView } from "../../../components/locationStats/locationStatsView";
import { getFishingMode } from "../../../lib/mock/dashboardData";
import { getLocationStatsData } from "../../../lib/mock/locationStatsData";

interface LocationStatsPageProps {
  searchParams?: Promise<{
    mode?: string;
  }>;
}

export default async function LocationStatsPage({
  searchParams,
}: LocationStatsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeMode = getFishingMode(resolvedSearchParams?.mode);
  const data = getLocationStatsData(activeMode);

  return <LocationStatsView activeMode={activeMode} data={data} />;
}
