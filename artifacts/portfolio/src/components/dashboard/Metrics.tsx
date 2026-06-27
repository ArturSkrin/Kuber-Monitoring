import { useGetClusterMetrics, useGetNodeMetrics, useGetPodMetrics } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

export function Metrics() {
  const { data: metrics, isLoading, isError } = useGetClusterMetrics({
    query: { refetchInterval: 30000 }
  });

  const { data: nodeMetrics, isLoading: nodesLoading } = useGetNodeMetrics({
    query: { refetchInterval: 30000 }
  });

  const { data: podMetrics, isLoading: podsLoading } = useGetPodMetrics({
    query: { refetchInterval: 30000 }
  });

  if (isError) {
    return (
      <Card className="bg-card/50 border-destructive/20 col-span-full">
        <CardContent className="p-4 text-destructive text-sm">Failed to load metrics</CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Cluster Total</h3>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground">CPU Usage</span>
              <span className="text-primary font-mono">{isLoading ? "..." : `${metrics?.cpuUsagePercent.toFixed(1)}%`}</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress value={metrics?.cpuUsagePercent} className="h-2" />
            )}
            <div className="text-[10px] text-muted-foreground mt-1 text-right">
              {isLoading ? "..." : `${metrics?.cpuUsageCores.toFixed(2)} cores active`}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground">Memory Usage</span>
              <span className="text-primary font-mono">{isLoading ? "..." : `${metrics?.memoryUsagePercent.toFixed(1)}%`}</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress value={metrics?.memoryUsagePercent} className="h-2" />
            )}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 border-t border-border/20 pt-4">Nodes</h3>
           <div className="space-y-3">
             {nodesLoading ? <Skeleton className="h-10 w-full" /> : (
               nodeMetrics?.map((nm) => (
                 <div key={nm.node} className="bg-black/20 p-2 rounded">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-mono text-muted-foreground">{nm.node}</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground mb-1">CPU <span className="text-primary">{nm.cpuUsagePercent.toFixed(0)}%</span></div>
                        <Progress value={nm.cpuUsagePercent} className="h-1" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground mb-1">MEM <span className="text-primary">{nm.memoryUsagePercent.toFixed(0)}%</span></div>
                        <Progress value={nm.memoryUsagePercent} className="h-1" />
                      </div>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 border-t border-border/20 pt-4">Pod Phases</h3>
           {podsLoading ? <Skeleton className="h-10 w-full" /> : podMetrics && (
             <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="bg-success/10 border border-success/20 rounded p-1">
                   <div className="text-success">{podMetrics.running}</div>
                   <div className="text-[8px] text-muted-foreground">RUN</div>
                </div>
                <div className="bg-warning/10 border border-warning/20 rounded p-1">
                   <div className="text-warning">{podMetrics.pending}</div>
                   <div className="text-[8px] text-muted-foreground">PND</div>
                </div>
                <div className="bg-destructive/10 border border-destructive/20 rounded p-1">
                   <div className="text-destructive">{podMetrics.failed}</div>
                   <div className="text-[8px] text-muted-foreground">FAIL</div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded p-1">
                   <div className="text-primary">{podMetrics.succeeded}</div>
                   <div className="text-[8px] text-muted-foreground">SUCC</div>
                </div>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
