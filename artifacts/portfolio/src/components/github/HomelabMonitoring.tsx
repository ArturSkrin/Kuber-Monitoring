import { useState } from "react";
import {
  useGetNodes, getGetNodesQueryKey,
  useGetWorkloads, getGetWorkloadsQueryKey,
  useGetArgoCdApps, getGetArgoCdAppsQueryKey,
  useGetClusterSummary, getGetClusterSummaryQueryKey,
  useGetClusterMetrics, getGetClusterMetricsQueryKey,
  useGetNodeMetrics, getGetNodeMetricsQueryKey,
  useGetPodMetrics, getGetPodMetricsQueryKey,
  useGetPodRestarts, getGetPodRestartsQueryKey,
  useGetPublicServices, getGetPublicServicesQueryKey,
  useGetLogsSummary, getGetLogsSummaryQueryKey,
  useHealthCheck, getHealthCheckQueryKey,
  useGetRecentDeployments, getGetRecentDeploymentsQueryKey
} from "@workspace/api-client-react";
import { Activity, RefreshCw, Layers, Server, Box, Cpu, HardDrive, Globe, AlertCircle } from "lucide-react";

const BOX = "border border-[#d0d7de] dark:border-[#30363d] rounded-[6px] bg-white dark:bg-[#0d1117]";
const HEADER = "bg-[#f6f8fa] dark:bg-[#161b22] border-b border-[#d0d7de] dark:border-[#30363d] px-4 py-2.5 flex items-center gap-2 text-sm font-semibold text-[#1f2328] dark:text-[#e6edf3]";
const DIVIDER = "border-[#d0d7de] dark:border-[#30363d]";
const MUTED = "text-[#59636e] dark:text-[#7d8590]";
const PRIMARY = "text-[#1f2328] dark:text-[#e6edf3]";
const ACCENT = "text-[#0969da] dark:text-[#2f81f7]";

function StatusBadge({ status, text }: { status: 'success' | 'danger' | 'warning', text: string }) {
  const color = status === 'success' ? '#3fb950' : status === 'danger' ? '#f85149' : '#d29922';
  return (
    <div className="flex items-center gap-1.5 border border-[#d0d7de] dark:border-[#30363d] rounded-full px-2 py-0.5 bg-[#f6f8fa] dark:bg-[#161b22]">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
      <span className="text-xs text-[#1f2328] dark:text-[#e6edf3] font-medium leading-none">{text}</span>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-[#eaeef2] dark:bg-[#21262d] rounded w-3/4"></div>
      <div className="h-4 bg-[#eaeef2] dark:bg-[#21262d] rounded w-1/2"></div>
      <div className="h-4 bg-[#eaeef2] dark:bg-[#21262d] rounded w-5/6"></div>
    </div>
  );
}

export function HomelabMonitoring() {
  const [live, setLive] = useState(true);
  const [showWorkloads, setShowWorkloads] = useState(false);

  const refetchInterval: number | false = live ? 30000 : false;
  const qOpts = { query: { refetchInterval } };

  const { data: nodes, isLoading: loadingNodes } = useGetNodes({ query: { ...qOpts.query, queryKey: getGetNodesQueryKey() } });
  const { data: workloads, isLoading: loadingWorkloads } = useGetWorkloads({ query: { ...qOpts.query, queryKey: getGetWorkloadsQueryKey() } });
  const { data: apps, isLoading: loadingApps } = useGetArgoCdApps({ query: { ...qOpts.query, queryKey: getGetArgoCdAppsQueryKey() } });

  const { data: summary } = useGetClusterSummary({ query: { ...qOpts.query, queryKey: getGetClusterSummaryQueryKey() } });
  const { data: clusterMetrics } = useGetClusterMetrics({ query: { ...qOpts.query, queryKey: getGetClusterMetricsQueryKey() } });
  const { data: nodeMetrics } = useGetNodeMetrics({ query: { ...qOpts.query, queryKey: getGetNodeMetricsQueryKey() } });
  const { data: podMetrics } = useGetPodMetrics({ query: { ...qOpts.query, queryKey: getGetPodMetricsQueryKey() } });
  const { data: podRestarts } = useGetPodRestarts({ query: { ...qOpts.query, queryKey: getGetPodRestartsQueryKey() } });
  const { data: services } = useGetPublicServices({ query: { ...qOpts.query, queryKey: getGetPublicServicesQueryKey() } });
  const { data: logsSummary } = useGetLogsSummary({ query: { ...qOpts.query, queryKey: getGetLogsSummaryQueryKey() } });
  const { data: health } = useHealthCheck({ query: { ...qOpts.query, queryKey: getHealthCheckQueryKey() } });
  const { data: recentDeps } = useGetRecentDeployments({ query: { ...qOpts.query, queryKey: getGetRecentDeploymentsQueryKey() } });

  return (
    <div className="mt-8 space-y-6">
      <div className={`flex items-center justify-between pb-2 border-b ${DIVIDER}`}>
        <h2 className={`text-xl font-normal ${PRIMARY} flex items-center gap-2`}>
          <Activity className={`w-5 h-5 ${MUTED}`} />
          Home Lab Status
          {health && <StatusBadge status={health.status === 'ok' ? 'success' : 'danger'} text="API" />}
        </h2>
        <button
          onClick={() => setLive(!live)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${live ? 'bg-[#1f883d] text-white border-[#1f883d] hover:bg-[#1a7f37] dark:bg-[#238636] dark:border-[#2ea043] dark:hover:bg-[#2ea043]' : 'bg-[#f6f8fa] text-[#1f2328] border-[#d0d7de] hover:bg-[#eef1f4] dark:bg-[#21262d] dark:text-[#c9d1d9] dark:border-[#30363d] dark:hover:bg-[#30363d]'}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${live ? 'animate-spin-slow' : ''}`} />
          {live ? "Live Updates: ON" : "Live Updates: OFF"}
        </button>
      </div>

      {summary && clusterMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className={`${BOX} p-4 text-center`}>
            <div className={`text-xs ${MUTED} mb-1`}>Nodes Ready</div>
            <div className={`text-xl ${PRIMARY} font-semibold`}>{summary.nodeReadyCount}/{summary.nodeCount}</div>
          </div>
          <div className={`${BOX} p-4 text-center`}>
            <div className={`text-xs ${MUTED} mb-1`}>Pods Running</div>
            <div className={`text-xl ${PRIMARY} font-semibold`}>{summary.podRunning}/{summary.podTotal}</div>
          </div>
          <div className={`${BOX} p-4 text-center`}>
            <div className={`text-xs ${MUTED} mb-1`}>CPU Usage</div>
            <div className={`text-xl ${PRIMARY} font-semibold`}>{clusterMetrics.cpuUsagePercent.toFixed(1)}%</div>
          </div>
          <div className={`${BOX} p-4 text-center`}>
            <div className={`text-xs ${MUTED} mb-1`}>Memory Usage</div>
            <div className={`text-xl ${PRIMARY} font-semibold`}>{clusterMetrics.memoryUsagePercent.toFixed(1)}%</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Apps / Releases */}
        <div className={`${BOX} overflow-hidden flex flex-col`}>
          <div className={HEADER}>
            <Layers className={`w-4 h-4 ${MUTED}`} />
            Apps / Releases
          </div>
          <div className="p-4 flex-1">
            {loadingApps && !apps ? <SkeletonList /> : (
              apps?.map(app => (
                <div key={app.name} className={`flex items-center justify-between py-3 border-b ${DIVIDER} last:border-0 group`}>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-sm font-semibold ${ACCENT}`}>{app.name}</span>
                    <span className={`text-xs ${MUTED}`}>NS: {app.destinationNamespace}</span>
                  </div>
                  <StatusBadge
                    status={app.healthStatus === 'Healthy' && app.syncStatus === 'Synced' ? 'success' : app.healthStatus === 'Degraded' ? 'danger' : 'warning'}
                    text={app.healthStatus === 'Healthy' ? 'Deployed' : app.healthStatus}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kubernetes Nodes */}
        <div className={`${BOX} overflow-hidden flex flex-col`}>
          <div className={HEADER}>
            <Server className={`w-4 h-4 ${MUTED}`} />
            Kubernetes Nodes
          </div>
          <div className="p-4 flex-1">
            {loadingNodes && !nodes ? <SkeletonList /> : (
              nodes?.map(node => {
                const metrics = nodeMetrics?.find(m => m.node === node.name);
                return (
                  <div key={node.name} className={`flex flex-col gap-2 py-3 border-b ${DIVIDER} last:border-0 group`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${PRIMARY}`}>{node.name}</span>
                      <StatusBadge status={node.status === 'Ready' ? 'success' : 'danger'} text={node.status} />
                    </div>
                    <div className={`flex gap-4 text-xs ${MUTED} justify-between`}>
                      <span>{node.roles && node.roles.length > 0 ? node.roles.join(', ') : 'worker'}</span>
                      {metrics ? (
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {metrics.cpuUsagePercent.toFixed(0)}%</span>
                          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {metrics.memoryUsagePercent.toFixed(0)}%</span>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {node.cpu}</span>
                          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {node.memory}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Public Services */}
        <div className={`${BOX} overflow-hidden flex flex-col`}>
          <div className={HEADER}>
            <Globe className={`w-4 h-4 ${MUTED}`} />
            Public Services
          </div>
          <div className="p-4 flex-1">
            {!services ? <SkeletonList /> : (
              services.map(svc => (
                <div key={svc.name} className={`flex items-center justify-between py-2 border-b ${DIVIDER} last:border-0`}>
                  <div className="flex flex-col gap-0.5">
                    <a href={svc.url} target="_blank" rel="noreferrer" className={`text-sm font-semibold ${ACCENT} hover:underline`}>{svc.name}</a>
                    <span className={`text-xs ${MUTED}`}>{svc.latencyMs}ms latency</span>
                  </div>
                  <StatusBadge
                    status={svc.status === 'up' ? 'success' : svc.status === 'degraded' ? 'warning' : 'danger'}
                    text={svc.status === 'up' ? 'Operational' : svc.status}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts & Issues */}
        <div className={`${BOX} overflow-hidden flex flex-col`}>
          <div className={HEADER}>
            <AlertCircle className={`w-4 h-4 ${MUTED}`} />
            Alerts & Issues
          </div>
          <div className="p-4 flex-1 flex flex-col gap-4">
            {logsSummary && logsSummary.totalErrors > 0 && (
              <div className="text-xs">
                <span className="text-[#cf222e] dark:text-[#f85149] font-semibold">{logsSummary.totalErrors} Errors</span> logged across {logsSummary.namespacesWithErrors.join(', ')}
              </div>
            )}
            {podRestarts && podRestarts.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className={`text-xs ${MUTED} uppercase tracking-wider`}>Top Restarts</div>
                {podRestarts.slice(0, 3).map(r => (
                  <div key={r.pod} className={`flex justify-between items-center text-sm border-b ${DIVIDER} pb-2 last:border-0`}>
                    <span className={`${PRIMARY} truncate max-w-[200px]`}>{r.pod}</span>
                    <span className="text-[#9a6700] dark:text-[#d29922] font-mono">{r.restarts}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-xs ${MUTED}`}>No pod restarts detected recently.</div>
            )}
            {podMetrics && (
              <div className={`flex gap-3 text-xs ${MUTED} mt-auto`}>
                <span>Running: {podMetrics.running}</span>
                {podMetrics.pending > 0 && <span className="text-[#9a6700] dark:text-[#d29922]">Pending: {podMetrics.pending}</span>}
                {podMetrics.failed > 0 && <span className="text-[#cf222e] dark:text-[#f85149]">Failed: {podMetrics.failed}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workloads Area */}
      <div className={`${BOX} overflow-hidden`}>
        <button
          onClick={() => setShowWorkloads(!showWorkloads)}
          className="w-full bg-[#f6f8fa] hover:bg-[#eaeef2] dark:bg-[#161b22] dark:hover:bg-[#21262d] px-4 py-3 flex items-center justify-between text-sm font-semibold text-[#1f2328] dark:text-[#e6edf3] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Box className={`w-4 h-4 ${MUTED}`} />
            Workloads <span className={`text-xs ${MUTED} font-normal ml-2`}>(Pods &amp; Deployments)</span>
          </div>
          <span className={`text-xs ${MUTED} border ${DIVIDER} rounded-md px-2 py-0.5 bg-white dark:bg-[#0d1117]`}>
            {showWorkloads ? "Hide" : "Show"}
          </span>
        </button>

        {showWorkloads && (
          <div className={`p-4 border-t ${DIVIDER} bg-white dark:bg-[#0d1117] flex flex-col gap-4`}>
            {loadingWorkloads && !workloads ? <SkeletonList /> : (
              workloads && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`text-xs font-semibold ${MUTED} uppercase tracking-wider mb-2`}>Deployments</h4>
                    {recentDeps && recentDeps.length > 0 ? (
                      recentDeps.slice(0, 8).map(dep => (
                        <div key={dep.name} className={`flex justify-between items-center py-2 border-b ${DIVIDER} last:border-0`}>
                          <span className={`text-sm ${PRIMARY} truncate max-w-[200px]`}>{dep.name}</span>
                          <span className={`text-xs ${MUTED}`}>{dep.readyReplicas}/{dep.desiredReplicas} ready</span>
                        </div>
                      ))
                    ) : (
                      workloads.deployments.slice(0, 8).map(dep => (
                        <div key={dep.name} className={`flex justify-between items-center py-2 border-b ${DIVIDER} last:border-0`}>
                          <span className={`text-sm ${PRIMARY} truncate max-w-[200px]`}>{dep.name}</span>
                          <span className={`text-xs ${MUTED}`}>{dep.readyReplicas}/{dep.desiredReplicas} ready</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${MUTED} uppercase tracking-wider mb-2`}>Recent Pods</h4>
                    {workloads.pods.length === 0 ? (
                      <span className={`text-xs ${MUTED}`}>No pods found.</span>
                    ) : (
                      workloads.pods.slice(0, 8).map(pod => (
                        <div key={pod.name} className={`flex justify-between items-center py-2 border-b ${DIVIDER} last:border-0`}>
                          <span className={`text-sm ${PRIMARY} truncate max-w-[200px]`} title={pod.name}>{pod.name}</span>
                          <StatusBadge
                            status={pod.status === 'Running' || pod.status === 'Succeeded' ? 'success' : pod.status === 'Pending' ? 'warning' : 'danger'}
                            text={pod.status}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
