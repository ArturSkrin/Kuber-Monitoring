import { useGetClusterSummary, getGetClusterSummaryQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Server } from "lucide-react";

export function Header() {
  const { data: summary, isLoading, isError } = useGetClusterSummary({
    query: { refetchInterval: 30000, queryKey: getGetClusterSummaryQueryKey() }
  });

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/50 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Server className="w-6 h-6" />
          KUBERNETES_HOMELAB
        </h1>
        <p className="text-sm text-muted-foreground mt-1 tracking-wider uppercase">
          Mission Control // Operations Dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isLoading ? (
          <Skeleton className="w-32 h-8" />
        ) : isError ? (
          <Badge variant="destructive" className="font-mono">STATUS: ERROR</Badge>
        ) : (
          <>
            <Badge variant="outline" className="border-primary/50 text-primary font-mono uppercase">
              {summary?.kubernetesVersion || "v1.0.0"}
            </Badge>
            <Badge className="bg-success text-success-foreground hover:bg-success/90 font-mono uppercase flex items-center gap-1">
              <Activity className="w-3 h-3" />
              SYSTEMS GREEN
            </Badge>
          </>
        )}
      </div>
    </header>
  );
}
