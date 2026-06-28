import { useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { ClusterSummaryStats } from "@/components/dashboard/ClusterSummaryStats";
import { Metrics } from "@/components/dashboard/Metrics";
import { NodesTable } from "@/components/dashboard/NodesTable";
import { PublicServices } from "@/components/dashboard/PublicServices";
import { ArgoCdApps } from "@/components/dashboard/ArgoCd";
import { RecentDeployments } from "@/components/dashboard/Deployments";
import { IssuesPanel } from "@/components/dashboard/IssuesPanel";
import { StackSection } from "@/components/dashboard/StackSection";
import { NamespacesOverview } from "@/components/dashboard/NamespacesOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />
        
        <ClusterSummaryStats />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <NodesTable />
          </div>
          <div className="md:col-span-1">
            <Metrics />
          </div>
        </div>

        <PublicServices />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ArgoCdApps />
          </div>
          <div className="md:col-span-1">
            <RecentDeployments />
          </div>
          <div className="md:col-span-1">
            <NamespacesOverview />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <IssuesPanel />
          </div>
          <div className="md:col-span-1">
             <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-2 border-b border-border/50">
                <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Terminal Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                 <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    {`> kubectl get events --sort-by='.metadata.creationTimestamp'
> tail -f /var/log/syslog
> ping 8.8.8.8
...`}
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <StackSection />
        
        <footer className="pt-8 pb-4 text-center text-xs font-mono text-muted-foreground border-t border-border/30">
          <p>KUBERNETES HOMELAB DASHBOARD // {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
