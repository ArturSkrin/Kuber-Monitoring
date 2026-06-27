import { useGetClusterSummary } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Boxes, Layers, Box } from "lucide-react";

export function ClusterSummaryStats() {
  const { data: summary, isLoading, isError } = useGetClusterSummary({
    query: { refetchInterval: 30000 }
  });

  if (isError) {
    return (
      <div className="text-destructive text-sm font-mono border border-destructive/20 bg-destructive/10 p-4 rounded-md">
        Failed to load cluster summary.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        title="NODES" 
        value={isLoading ? null : `${summary?.nodeReadyCount}/${summary?.nodeCount}`} 
        subtitle="Ready"
        icon={<Cpu className="w-4 h-4 text-primary" />}
      />
      <StatCard 
        title="PODS" 
        value={isLoading ? null : summary?.podRunning} 
        subtitle={`Total: ${summary?.podTotal || 0} | Fail: ${summary?.podFailed || 0}`}
        icon={<Box className="w-4 h-4 text-primary" />}
      />
      <StatCard 
        title="DEPLOYMENTS" 
        value={isLoading ? null : `${summary?.deploymentReady}/${summary?.deploymentTotal}`} 
        subtitle="Ready"
        icon={<Boxes className="w-4 h-4 text-primary" />}
      />
      <StatCard 
        title="NAMESPACES" 
        value={isLoading ? null : summary?.namespaceCount} 
        subtitle="Active"
        icon={<Layers className="w-4 h-4 text-primary" />}
      />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string, value: string | number | null | undefined, subtitle: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold text-foreground">
          {value === null || value === undefined ? <Skeleton className="h-8 w-16" /> : value}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {value === null || value === undefined ? <Skeleton className="h-3 w-24 mt-1" /> : subtitle}
        </div>
      </CardContent>
    </Card>
  );
}
