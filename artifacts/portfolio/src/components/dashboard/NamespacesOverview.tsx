import { useGetNamespaces } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NamespacesOverview() {
  const { data: namespaces, isLoading, isError } = useGetNamespaces({
    query: { refetchInterval: 30000 }
  });

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Namespaces
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isError && <div className="p-4 text-destructive text-sm">Failed to load namespaces</div>}
        {isLoading && <div className="p-4 space-y-3"><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div>}
        
        {!isLoading && !isError && namespaces && (
          <div className="divide-y divide-border/20 max-h-[300px] overflow-y-auto custom-scrollbar">
            {namespaces.map(ns => (
              <div key={ns.name} className="p-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div className="font-mono text-sm text-foreground truncate max-w-[70%]">{ns.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">{ns.podCount} pods</span>
                  <Badge variant={ns.status === 'Active' ? 'default' : 'secondary'} className={ns.status === 'Active' ? 'bg-success/20 text-success border-success/30 text-[10px] uppercase px-1.5 py-0' : 'text-[10px] uppercase px-1.5 py-0'}>
                    {ns.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
