import { LogsView } from "../../../components/logs/logs-view";
import { getFishingMode } from "../../../lib/mock/dashboard-data";
import { getLogs } from "../../../lib/mock/logs-data";

interface LogsPageProps {
  searchParams?: Promise<{
    mode?: string;
  }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeMode = getFishingMode(resolvedSearchParams?.mode);
  const logs = getLogs(activeMode);

  return <LogsView activeMode={activeMode} logs={logs} />;
}
