import { useGetPublicServices, getGetPublicServicesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Activity, Clock } from "lucide-react";

export function PublicServices() {
  const { data: services, isLoading, isError } = useGetPublicServices({
    query: { refetchInterval: 30000, queryKey: getGetPublicServicesQueryKey() }
  });

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm col-span-full">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Public Services
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isError && <div className="text-destructive text-sm">Failed to load public services</div>}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        
        {!isLoading && !isError && services && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <div key={service.name} className="border border-border/30 rounded-lg p-3 bg-black/20 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-primary font-bold">{service.name}</div>
                  <Badge variant={service.status === 'Up' ? 'default' : 'destructive'} 
                         className={service.status === 'Up' ? 'bg-success/20 text-success border-success/30 uppercase text-[10px] px-1.5 py-0' : 'uppercase text-[10px] px-1.5 py-0'}>
                    {service.status}
                  </Badge>
                </div>
                <a href={service.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors block mb-3 truncate">
                  {service.url}
                </a>
                <div className="flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="w-3 h-3" /> 
                    <span className={service.httpStatus >= 200 && service.httpStatus < 400 ? 'text-success' : 'text-warning'}>
                      HTTP {service.httpStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className={service.latencyMs > 500 ? 'text-warning' : ''}>{service.latencyMs}ms</span>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="text-muted-foreground text-sm py-4 col-span-full text-center border border-dashed border-border/50 rounded-lg">
                No public services configured
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
