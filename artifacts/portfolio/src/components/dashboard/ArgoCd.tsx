import { useGetArgoCdApps, getGetArgoCdAppsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch, RefreshCw, HeartPulse } from "lucide-react";

export function ArgoCdApps() {
  const { data: apps, isLoading, isError } = useGetArgoCdApps({
    query: { refetchInterval: 30000, queryKey: getGetArgoCdAppsQueryKey() }
  });

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          GitOps / ArgoCD
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isError && <div className="p-4 text-destructive text-sm">Failed to load ArgoCD apps</div>}
        {isLoading && <div className="p-4 space-y-3"><Skeleton className="h-12 w-full"/><Skeleton className="h-12 w-full"/></div>}
        
        {!isLoading && !isError && apps && (
          <div className="divide-y divide-border/20">
            {apps.map(app => (
              <div key={app.name} className="p-3 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-mono text-sm text-foreground">{app.name}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-[10px] uppercase font-mono px-1.5 py-0 ${app.syncStatus === 'Synced' ? 'text-success border-success/30' : 'text-warning border-warning/30'}`}>
                      <RefreshCw className="w-2.5 h-2.5 mr-1 inline" />
                      {app.syncStatus}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] uppercase font-mono px-1.5 py-0 ${app.healthStatus === 'Healthy' ? 'text-success border-success/30' : 'text-destructive border-destructive/30'}`}>
                      <HeartPulse className="w-2.5 h-2.5 mr-1 inline" />
                      {app.healthStatus}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span className="truncate max-w-[60%]">{app.destinationNamespace}</span>
                  <span className="font-mono bg-black/30 px-1 rounded">{app.targetRevision}</span>
                </div>
              </div>
            ))}
            {apps.length === 0 && (
              <div className="text-muted-foreground text-sm p-6 text-center">
                No GitOps apps found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
