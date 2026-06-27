import { Router, type IRouter } from "express";
import {
  k8sGet,
  isInCluster,
  isNodeReady,
  getPodRestarts,
  type K8sNodeList,
  type K8sNamespaceList,
  type K8sPodList,
  type K8sDeploymentList,
  type K8sVersionInfo,
} from "../lib/k8s";
import {
  mockClusterSummary,
  mockNodes,
  mockNamespaces,
  mockPods,
  mockDeployments,
} from "../lib/mockdata";
import {
  GetClusterSummaryResponse,
  GetNodesResponse,
  GetNamespacesResponse,
  GetWorkloadsResponse,
  GetRecentDeploymentsResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/cluster/summary", async (req, res): Promise<void> => {
  if (!isInCluster()) {
    req.log.info("Not in cluster — returning mock cluster summary");
    res.json(GetClusterSummaryResponse.parse(mockClusterSummary));
    return;
  }

  try {
    const [versionInfo, nodeList, podList, deployList, nsList] = await Promise.all([
      k8sGet<K8sVersionInfo>("/version"),
      k8sGet<K8sNodeList>("/api/v1/nodes"),
      k8sGet<K8sPodList>("/api/v1/pods"),
      k8sGet<K8sDeploymentList>("/apis/apps/v1/deployments"),
      k8sGet<K8sNamespaceList>("/api/v1/namespaces"),
    ]);

    const nodes = nodeList.items ?? [];
    const pods = podList.items ?? [];
    const deploys = deployList.items ?? [];
    const nss = nsList.items ?? [];

    const podRunning = pods.filter((p) => p.status.phase === "Running").length;
    const podPending = pods.filter((p) => p.status.phase === "Pending").length;
    const podFailed = pods.filter((p) => p.status.phase === "Failed").length;

    const deployReady = deploys.filter(
      (d) => (d.status.readyReplicas ?? 0) >= d.spec.replicas,
    ).length;

    const summary = {
      kubernetesVersion: versionInfo.gitVersion ?? "unknown",
      nodeCount: nodes.length,
      nodeReadyCount: nodes.filter(isNodeReady).length,
      namespaceCount: nss.length,
      podTotal: pods.length,
      podRunning,
      podPending,
      podFailed,
      deploymentTotal: deploys.length,
      deploymentReady: deployReady,
    };

    res.json(GetClusterSummaryResponse.parse(summary));
  } catch (err) {
    logger.error({ err }, "Failed to fetch cluster summary from K8s API, using mock");
    res.json(GetClusterSummaryResponse.parse(mockClusterSummary));
  }
});

router.get("/nodes", async (req, res): Promise<void> => {
  if (!isInCluster()) {
    res.json(GetNodesResponse.parse(mockNodes));
    return;
  }

  try {
    const nodeList = await k8sGet<K8sNodeList>("/api/v1/nodes");
    const nodes = (nodeList.items ?? []).map((n) => {
      const roles: string[] = [];
      const labels = (n.metadata as unknown as { labels?: Record<string, string> }).labels ?? {};
      if (labels["node-role.kubernetes.io/control-plane"] !== undefined) roles.push("control-plane");
      if (labels["node-role.kubernetes.io/master"] !== undefined) roles.push("master");
      if (roles.length === 0) roles.push("worker");

      return {
        name: n.metadata.name,
        status: isNodeReady(n) ? "Ready" : "NotReady",
        roles,
        kubeletVersion: n.status.nodeInfo.kubeletVersion,
        osImage: n.status.nodeInfo.osImage,
        cpu: n.status.capacity.cpu,
        memory: n.status.capacity.memory,
        createdAt: n.metadata.creationTimestamp ?? null,
      };
    });

    res.json(GetNodesResponse.parse(nodes));
  } catch (err) {
    logger.error({ err }, "Failed to fetch nodes, using mock");
    res.json(GetNodesResponse.parse(mockNodes));
  }
});

router.get("/namespaces", async (req, res): Promise<void> => {
  if (!isInCluster()) {
    res.json(GetNamespacesResponse.parse(mockNamespaces));
    return;
  }

  try {
    const [nsList, podList] = await Promise.all([
      k8sGet<K8sNamespaceList>("/api/v1/namespaces"),
      k8sGet<K8sPodList>("/api/v1/pods"),
    ]);

    const podsByNs = new Map<string, number>();
    for (const pod of podList.items ?? []) {
      const ns = pod.metadata.namespace;
      podsByNs.set(ns, (podsByNs.get(ns) ?? 0) + 1);
    }

    const namespaces = (nsList.items ?? []).map((ns) => ({
      name: ns.metadata.name,
      status: ns.status.phase,
      podCount: podsByNs.get(ns.metadata.name) ?? 0,
      createdAt: ns.metadata.creationTimestamp ?? null,
    }));

    res.json(GetNamespacesResponse.parse(namespaces));
  } catch (err) {
    logger.error({ err }, "Failed to fetch namespaces, using mock");
    res.json(GetNamespacesResponse.parse(mockNamespaces));
  }
});

router.get("/workloads", async (req, res): Promise<void> => {
  if (!isInCluster()) {
    res.json(GetWorkloadsResponse.parse({ pods: mockPods, deployments: mockDeployments }));
    return;
  }

  try {
    const [podList, deployList] = await Promise.all([
      k8sGet<K8sPodList>("/api/v1/pods"),
      k8sGet<K8sDeploymentList>("/apis/apps/v1/deployments"),
    ]);

    const pods = (podList.items ?? []).map((p) => ({
      name: p.metadata.name,
      namespace: p.metadata.namespace,
      status: p.status.phase ?? "Unknown",
      restarts: getPodRestarts(p),
      node: p.spec.nodeName ?? "",
      createdAt: p.metadata.creationTimestamp ?? null,
    }));

    const deployments = (deployList.items ?? []).map((d) => {
      const lastUpdate =
        d.status.conditions
          ?.map((c) => c.lastUpdateTime)
          .filter(Boolean)
          .sort()
          .reverse()[0] ?? null;
      return {
        name: d.metadata.name,
        namespace: d.metadata.namespace,
        desiredReplicas: d.spec.replicas ?? 0,
        readyReplicas: d.status.readyReplicas ?? 0,
        availableReplicas: d.status.availableReplicas ?? 0,
        updatedAt: lastUpdate ?? null,
      };
    });

    res.json(GetWorkloadsResponse.parse({ pods, deployments }));
  } catch (err) {
    logger.error({ err }, "Failed to fetch workloads, using mock");
    res.json(GetWorkloadsResponse.parse({ pods: mockPods, deployments: mockDeployments }));
  }
});

router.get("/deployments/recent", async (req, res): Promise<void> => {
  if (!isInCluster()) {
    res.json(GetRecentDeploymentsResponse.parse(mockDeployments));
    return;
  }

  try {
    const deployList = await k8sGet<K8sDeploymentList>("/apis/apps/v1/deployments");

    const deployments = (deployList.items ?? [])
      .map((d) => {
        const lastUpdate =
          d.status.conditions
            ?.map((c) => c.lastUpdateTime)
            .filter(Boolean)
            .sort()
            .reverse()[0] ?? null;
        return {
          name: d.metadata.name,
          namespace: d.metadata.namespace,
          desiredReplicas: d.spec.replicas ?? 0,
          readyReplicas: d.status.readyReplicas ?? 0,
          availableReplicas: d.status.availableReplicas ?? 0,
          updatedAt: lastUpdate ?? d.metadata.creationTimestamp ?? null,
        };
      })
      .sort((a, b) => {
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
      .slice(0, 10);

    res.json(GetRecentDeploymentsResponse.parse(deployments));
  } catch (err) {
    logger.error({ err }, "Failed to fetch recent deployments, using mock");
    res.json(GetRecentDeploymentsResponse.parse(mockDeployments));
  }
});

export default router;
