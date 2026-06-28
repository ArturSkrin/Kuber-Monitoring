import { useGetWorkloads, getGetWorkloadsQueryKey, useGetRecentDeployments, getGetRecentDeploymentsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, Box } from "lucide-react";

export function RecentDeployments() {
  const { data: deployments, isLoading: depsLoading, isError: depsError } = useGetRecentDeployments({
    query: { refetchInterval: 30000, queryKey: getGetRecentDeploymentsQueryKey() }
  });

  const { data: workloads, isLoading: wlLoading, isError: wlError } = useGetWorkloads({
    query: { refetchInterval: 30000, queryKey: getGetWorkloadsQueryKey() }
  });

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 border-b border-border/50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Rocket className="w-4 h-4" />
          Deployments & Workloads
        </CardTitle>
        {!wlLoading && !wlError && workloads && (
           <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary">
             {workloads.pods.length} PODS / {workloads.deployments.length} DEPS
           </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {depsError && <div className="p-4 text-destructive text-sm">Failed to load deployments</div>}
        {depsLoading && <div className="p-4 space-y-3"><Skeleton className="h-10 w-full"/><Skeleton className="h-10 w-full"/></div>}
        
        {!depsLoading && !depsError && deployments && (
          <div className="divide-y divide-border/20">
            {deployments.slice(0, 5).map(dep => (
              <div key={`${dep.namespace}-${dep.name}`} className="p-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <div className="font-mono text-sm text-foreground">{dep.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{dep.namespace}</div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className={`font-mono text-xs ${dep.readyReplicas === dep.desiredReplicas ? 'border-primary/30 text-primary' : 'border-warning/30 text-warning'}`}>
                    {dep.readyReplicas} / {dep.desiredReplicas}
                  </Badge>
                  {dep.updatedAt && (
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {new Date(dep.updatedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {deployments.length === 0 && (
              <div className="text-muted-foreground text-sm p-6 text-center">
                No recent deployments
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
