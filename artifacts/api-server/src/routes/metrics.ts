import { Router, type IRouter } from "express";
import { promQuery, promQueryVector } from "../lib/prometheus";
import {
  mockClusterMetrics,
  mockNodeMetrics,
  mockPodPhaseMetrics,
  mockPodRestarts,
} from "../lib/mockdata";
import {
  GetClusterMetricsResponse,
  GetNodeMetricsResponse,
  GetPodMetricsResponse,
  GetPodRestartsResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/metrics/cluster", async (req, res): Promise<void> => {
  try {
    const [cpuCores, memPct, desired, available] = await Promise.all([
      promQuery(
        `sum(rate(container_cpu_usage_seconds_total{container!="",pod!=""}[5m]))`,
      ),
      promQuery(
        `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100`,
      ),
      promQuery(`sum(kube_deployment_spec_replicas)`),
      promQuery(`sum(kube_deployment_status_replicas_available)`),
    ]);

    const totalCpu = 20;
    const cpuPct = cpuCores != null ? (cpuCores / totalCpu) * 100 : null;

    if (cpuCores == null && memPct == null) {
      req.log.info("Prometheus unavailable, returning mock cluster metrics");
      res.json(GetClusterMetricsResponse.parse(mockClusterMetrics));
      return;
    }

    res.json(
      GetClusterMetricsResponse.parse({
        cpuUsageCores: cpuCores ?? mockClusterMetrics.cpuUsageCores,
        cpuUsagePercent: cpuPct ?? mockClusterMetrics.cpuUsagePercent,
        memoryUsagePercent: memPct ?? mockClusterMetrics.memoryUsagePercent,
        desiredReplicas: Math.round(desired ?? mockClusterMetrics.desiredReplicas),
        availableReplicas: Math.round(available ?? mockClusterMetrics.availableReplicas),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Failed to fetch cluster metrics");
    res.json(GetClusterMetricsResponse.parse(mockClusterMetrics));
  }
});

router.get("/metrics/nodes", async (req, res): Promise<void> => {
  try {
    const [cpuResults, memResults] = await Promise.all([
      promQueryVector(
        `sum by (node) (rate(node_cpu_seconds_total{mode!="idle"}[5m])) / sum by (node) (rate(node_cpu_seconds_total[5m])) * 100`,
      ),
      promQueryVector(
        `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100`,
      ),
    ]);

    if (cpuResults.length === 0 && memResults.length === 0) {
      res.json(GetNodeMetricsResponse.parse(mockNodeMetrics));
      return;
    }

    const cpuByNode = new Map(cpuResults.map((r) => [r.metric.node ?? r.metric.instance, r.value]));
    const memByNode = new Map(memResults.map((r) => [r.metric.node ?? r.metric.instance, r.value]));

    const allNodes = new Set([...cpuByNode.keys(), ...memByNode.keys()]);
    const nodeMetrics = Array.from(allNodes).map((node) => ({
      node,
      cpuUsagePercent: Math.round((cpuByNode.get(node) ?? 0) * 10) / 10,
      memoryUsagePercent: Math.round((memByNode.get(node) ?? 0) * 10) / 10,
    }));

    res.json(GetNodeMetricsResponse.parse(nodeMetrics.length > 0 ? nodeMetrics : mockNodeMetrics));
  } catch (err) {
    logger.error({ err }, "Failed to fetch node metrics");
    res.json(GetNodeMetricsResponse.parse(mockNodeMetrics));
  }
});

router.get("/metrics/pods", async (req, res): Promise<void> => {
  try {
    const results = await promQueryVector(`sum by (phase) (kube_pod_status_phase)`);

    if (results.length === 0) {
      res.json(GetPodMetricsResponse.parse(mockPodPhaseMetrics));
      return;
    }

    const phases: Record<string, number> = {};
    for (const r of results) {
      const phase = (r.metric.phase ?? "Unknown").toLowerCase();
      phases[phase] = r.value;
    }

    res.json(
      GetPodMetricsResponse.parse({
        running: phases.running ?? 0,
        pending: phases.pending ?? 0,
        failed: phases.failed ?? 0,
        succeeded: phases.succeeded ?? 0,
        unknown: phases.unknown ?? 0,
      }),
    );
  } catch (err) {
    logger.error({ err }, "Failed to fetch pod metrics");
    res.json(GetPodMetricsResponse.parse(mockPodPhaseMetrics));
  }
});

router.get("/metrics/restarts", async (req, res): Promise<void> => {
  try {
    const results = await promQueryVector(
      `sort_desc(sum by (namespace, pod) (increase(kube_pod_container_status_restarts_total[24h])))`,
    );

    if (results.length === 0) {
      res.json(GetPodRestartsResponse.parse(mockPodRestarts));
      return;
    }

    const restarts = results
      .filter((r) => r.value > 0)
      .slice(0, 20)
      .map((r) => ({
        namespace: r.metric.namespace ?? "unknown",
        pod: r.metric.pod ?? "unknown",
        restarts: Math.round(r.value * 10) / 10,
      }));

    res.json(GetPodRestartsResponse.parse(restarts.length > 0 ? restarts : mockPodRestarts));
  } catch (err) {
    logger.error({ err }, "Failed to fetch pod restarts");
    res.json(GetPodRestartsResponse.parse(mockPodRestarts));
  }
});

export default router;
