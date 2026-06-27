export const mockClusterSummary = {
  kubernetesVersion: "v1.30.14",
  nodeCount: 3,
  nodeReadyCount: 3,
  namespaceCount: 8,
  podTotal: 42,
  podRunning: 39,
  podPending: 2,
  podFailed: 1,
  deploymentTotal: 14,
  deploymentReady: 13,
};

export const mockNodes = [
  {
    name: "k8s-master",
    status: "Ready",
    roles: ["control-plane", "master"],
    kubeletVersion: "v1.30.14",
    osImage: "Ubuntu 22.04.3 LTS",
    cpu: "4",
    memory: "8Gi",
    createdAt: "2024-09-01T12:00:00Z",
  },
  {
    name: "k8s-worker-1",
    status: "Ready",
    roles: ["worker"],
    kubeletVersion: "v1.30.14",
    osImage: "Ubuntu 22.04.3 LTS",
    cpu: "8",
    memory: "16Gi",
    createdAt: "2024-09-01T12:05:00Z",
  },
  {
    name: "k8s-worker-2",
    status: "Ready",
    roles: ["worker"],
    kubeletVersion: "v1.30.14",
    osImage: "Ubuntu 22.04.3 LTS",
    cpu: "8",
    memory: "16Gi",
    createdAt: "2024-09-02T09:00:00Z",
  },
];

export const mockNamespaces = [
  { name: "default", status: "Active", podCount: 0, createdAt: "2024-09-01T12:00:00Z" },
  { name: "kube-system", status: "Active", podCount: 12, createdAt: "2024-09-01T12:00:00Z" },
  { name: "monitoring", status: "Active", podCount: 9, createdAt: "2024-09-01T13:00:00Z" },
  { name: "argocd", status: "Active", podCount: 5, createdAt: "2024-09-01T13:30:00Z" },
  { name: "logging", status: "Active", podCount: 4, createdAt: "2024-09-01T14:00:00Z" },
  { name: "eve", status: "Active", podCount: 3, createdAt: "2024-10-15T10:00:00Z" },
  { name: "portfolio", status: "Active", podCount: 2, createdAt: "2025-01-10T08:00:00Z" },
  { name: "ingress-nginx", status: "Active", podCount: 2, createdAt: "2024-09-01T13:00:00Z" },
];

export const mockPods = [
  { name: "coredns-7db6d8ff4d-abc12", namespace: "kube-system", status: "Running", restarts: 0, node: "k8s-master", createdAt: "2024-09-01T12:10:00Z" },
  { name: "cilium-j9k2p", namespace: "kube-system", status: "Running", restarts: 1, node: "k8s-worker-1", createdAt: "2024-09-01T12:08:00Z" },
  { name: "prometheus-0", namespace: "monitoring", status: "Running", restarts: 0, node: "k8s-worker-1", createdAt: "2024-09-01T13:05:00Z" },
  { name: "grafana-7b9f8d-xvz44", namespace: "monitoring", status: "Running", restarts: 2, node: "k8s-worker-2", createdAt: "2024-09-01T13:10:00Z" },
  { name: "argocd-server-6d8c9f-kp3mn", namespace: "argocd", status: "Running", restarts: 0, node: "k8s-worker-2", createdAt: "2024-09-01T13:35:00Z" },
  { name: "loki-0", namespace: "logging", status: "Running", restarts: 0, node: "k8s-worker-1", createdAt: "2024-09-01T14:05:00Z" },
  { name: "eve-tools-deployment-abc99", namespace: "eve", status: "Running", restarts: 0, node: "k8s-worker-2", createdAt: "2024-10-15T10:15:00Z" },
  { name: "portfolio-api-xyz88", namespace: "portfolio", status: "Pending", restarts: 0, node: "k8s-worker-1", createdAt: "2025-01-10T08:05:00Z" },
];

export const mockDeployments = [
  { name: "grafana", namespace: "monitoring", desiredReplicas: 1, readyReplicas: 1, availableReplicas: 1, updatedAt: "2025-05-20T10:00:00Z" },
  { name: "argocd-server", namespace: "argocd", desiredReplicas: 1, readyReplicas: 1, availableReplicas: 1, updatedAt: "2025-05-18T14:00:00Z" },
  { name: "eve-tools", namespace: "eve", desiredReplicas: 2, readyReplicas: 2, availableReplicas: 2, updatedAt: "2025-06-01T09:30:00Z" },
  { name: "portfolio", namespace: "portfolio", desiredReplicas: 1, readyReplicas: 0, availableReplicas: 0, updatedAt: "2025-06-09T07:00:00Z" },
  { name: "ingress-nginx-controller", namespace: "ingress-nginx", desiredReplicas: 1, readyReplicas: 1, availableReplicas: 1, updatedAt: "2025-04-10T11:00:00Z" },
  { name: "kube-state-metrics", namespace: "monitoring", desiredReplicas: 1, readyReplicas: 1, availableReplicas: 1, updatedAt: "2025-03-15T08:00:00Z" },
];

export const mockClusterMetrics = {
  cpuUsageCores: 2.3,
  cpuUsagePercent: 28.7,
  memoryUsagePercent: 54.2,
  desiredReplicas: 14,
  availableReplicas: 13,
};

export const mockNodeMetrics = [
  { node: "k8s-master", cpuUsagePercent: 22.1, memoryUsagePercent: 61.4 },
  { node: "k8s-worker-1", cpuUsagePercent: 35.8, memoryUsagePercent: 48.9 },
  { node: "k8s-worker-2", cpuUsagePercent: 28.3, memoryUsagePercent: 52.1 },
];

export const mockPodPhaseMetrics = {
  running: 39,
  pending: 2,
  failed: 1,
  succeeded: 5,
  unknown: 0,
};

export const mockPodRestarts = [
  { namespace: "monitoring", pod: "grafana-7b9f8d-xvz44", restarts: 12 },
  { namespace: "kube-system", pod: "cilium-j9k2p", restarts: 5 },
  { namespace: "kube-system", pod: "coredns-7db6d8ff4d-abc12", restarts: 3 },
  { namespace: "argocd", pod: "argocd-repo-server-abc11", restarts: 1 },
  { namespace: "logging", pod: "loki-0", restarts: 0 },
];

export const mockArgoCdApps = [
  {
    name: "eve-online-tools",
    syncStatus: "Synced",
    healthStatus: "Healthy",
    repoUrl: "https://github.com/skrin/eve-online-tools",
    targetRevision: "main",
    destinationNamespace: "eve",
    lastSyncTime: "2025-06-09T06:45:00Z",
  },
  {
    name: "portfolio",
    syncStatus: "OutOfSync",
    healthStatus: "Progressing",
    repoUrl: "https://github.com/skrin/portfolio",
    targetRevision: "main",
    destinationNamespace: "portfolio",
    lastSyncTime: "2025-06-09T07:00:00Z",
  },
];

export const mockLogsSummary = {
  totalErrors: 7,
  namespacesWithErrors: ["monitoring", "kube-system"],
  topPodsWithErrors: [
    { pod: "grafana-7b9f8d-xvz44", namespace: "monitoring", count: 4 },
    { pod: "cilium-j9k2p", namespace: "kube-system", count: 3 },
  ],
  recentMessages: [
    "Failed to scrape target: connection refused",
    "Liveness probe failed: HTTP probe failed with status code 503",
    "Back-off restarting failed container",
  ],
};
