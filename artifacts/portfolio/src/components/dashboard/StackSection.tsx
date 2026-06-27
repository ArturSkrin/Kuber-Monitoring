import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STACK = [
  { name: "Kubernetes", desc: "Container orchestration platform", type: "core" },
  { name: "Cilium", desc: "eBPF-based networking & security", type: "network" },
  { name: "MetalLB", desc: "Bare metal load-balancer", type: "network" },
  { name: "ingress-nginx", desc: "Ingress controller", type: "network" },
  { name: "cert-manager", desc: "Automated TLS certificates", type: "security" },
  { name: "ArgoCD", desc: "Declarative GitOps continuous delivery", type: "ops" },
  { name: "Prometheus", desc: "Metrics & alerting", type: "obs" },
  { name: "Grafana", desc: "Observability dashboards", type: "obs" },
  { name: "Loki", desc: "Log aggregation system", type: "obs" },
  { name: "Cloudflare Tunnel", desc: "Secure public access", type: "network" },
];

export function StackSection() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm col-span-full">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Infrastructure Stack
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {STACK.map(tech => (
            <div key={tech.name} className="border border-border/40 bg-black/20 px-3 py-2 rounded-md hover:border-primary/40 transition-colors group cursor-default">
              <div className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">{tech.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{tech.desc}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
