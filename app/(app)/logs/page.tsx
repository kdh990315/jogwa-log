import { LogsView } from "../../../components/logs/logsView";
import { getFishingMode } from "../../../lib/mock/dashboardData";
import { getLogs } from "../../../lib/mock/logsData";

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
