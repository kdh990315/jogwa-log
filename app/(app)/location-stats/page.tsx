import { LocationStatsView } from "../../../components/location-stats/location-stats-view";
import { getFishingMode } from "../../../lib/mock/dashboard-data";
import { getLocationStatsData } from "../../../lib/mock/location-stats-data";

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
