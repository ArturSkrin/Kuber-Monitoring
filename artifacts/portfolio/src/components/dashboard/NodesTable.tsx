import { useGetNodes, getGetNodesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

export function NodesTable() {
  const { data: nodes, isLoading, isError } = useGetNodes({
    query: { refetchInterval: 30000, queryKey: getGetNodesQueryKey() }
  });

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Server className="w-4 h-4" />
          Nodes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isError && <div className="p-4 text-destructive text-sm">Failed to load nodes</div>}
        {isLoading && <div className="p-4 space-y-3"><Skeleton className="h-8 w-full"/><Skeleton className="h-8 w-full"/></div>}
        
        {!isLoading && !isError && nodes && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left text-muted-foreground">
                  <th className="p-3 font-normal">NAME</th>
                  <th className="p-3 font-normal">STATUS</th>
                  <th className="p-3 font-normal hidden sm:table-cell">ROLES</th>
                  <th className="p-3 font-normal hidden md:table-cell">VERSION</th>
                  <th className="p-3 font-normal text-right">CPU</th>
                  <th className="p-3 font-normal text-right">MEM</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(node => (
                  <tr key={node.name} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono text-primary">{node.name}</td>
                    <td className="p-3">
                      <Badge variant={node.status === 'Ready' ? 'default' : 'destructive'} className={node.status === 'Ready' ? 'bg-success/20 text-success border-success/30' : ''}>
                        {node.status}
                      </Badge>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-muted-foreground">{node.roles.join(', ') || '<none>'}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{node.kubeletVersion}</td>
                    <td className="p-3 text-right font-mono text-xs">{node.cpu}</td>
                    <td className="p-3 text-right font-mono text-xs">{node.memory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
