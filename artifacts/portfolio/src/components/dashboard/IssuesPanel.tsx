import { useGetPodRestarts, getGetPodRestartsQueryKey, useGetLogsSummary, getGetLogsSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertOctagon, Terminal } from "lucide-react";

export function IssuesPanel() {
  const { data: restarts, isLoading: restartsLoading } = useGetPodRestarts({
    query: { refetchInterval: 30000, queryKey: getGetPodRestartsQueryKey() }
  });
  
  const { data: logs, isLoading: logsLoading } = useGetLogsSummary({
    query: { refetchInterval: 30000, queryKey: getGetLogsSummaryQueryKey() }
  });

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm col-span-full md:col-span-2">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <AlertOctagon className="w-4 h-4" />
          System Issues & Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
        
        {/* Restarts */}
        <div className="p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-1">
            Pod Restarts (24h)
          </h3>
          {restartsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="space-y-2">
              {restarts && restarts.length > 0 ? restarts.map(pod => (
                <div key={`${pod.namespace}-${pod.pod}`} className="flex justify-between items-center text-sm font-mono bg-black/20 p-2 rounded">
                  <div className="truncate pr-4 text-foreground/80">{pod.pod}</div>
                  <div className="text-warning font-bold bg-warning/10 px-2 py-0.5 rounded">{pod.restarts}</div>
                </div>
              )) : (
                <div className="text-success text-sm font-mono border border-success/20 bg-success/5 p-2 rounded text-center">
                  0 Restarts Detected
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Terminal className="w-3 h-3" /> Recent Log Errors
            </h3>
            {!logsLoading && logs && (
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${logs.totalErrors > 0 ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
                {logs.totalErrors} ERRORS
              </span>
            )}
          </div>
          
          {logsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="space-y-2">
              {logs?.recentMessages && logs.recentMessages.length > 0 ? (
                logs.recentMessages.map((msg, i) => (
                  <div key={i} className="text-[10px] font-mono text-muted-foreground bg-black/40 p-2 rounded border-l-2 border-destructive/50 truncate">
                    {msg}
                  </div>
                ))
              ) : (
                <div className="text-[10px] font-mono text-muted-foreground bg-black/40 p-2 rounded text-center">
                  System logs normal. No recent critical errors.
                </div>
              )}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
