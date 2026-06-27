import { logger } from "./logger";

const PROMETHEUS_URL = process.env.PROMETHEUS_URL
  ?? "http://monitoring-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090";

export async function promQuery(query: string): Promise<number | null> {
  try {
    const url = new URL("/api/v1/query", PROMETHEUS_URL);
    url.searchParams.set("query", query);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status, query }, "Prometheus query failed");
      return null;
    }

    const json = (await res.json()) as {
      status: string;
      data: { resultType: string; result: Array<{ value: [number, string] }> };
    };

    if (json.status !== "success" || json.data.result.length === 0) {
      return null;
    }

    const val = parseFloat(json.data.result[0].value[1]);
    return isNaN(val) ? null : val;
  } catch (err) {
    logger.warn({ err, query }, "Prometheus query error");
    return null;
  }
}

export async function promQueryVector(
  query: string,
): Promise<Array<{ metric: Record<string, string>; value: number }>> {
  try {
    const url = new URL("/api/v1/query", PROMETHEUS_URL);
    url.searchParams.set("query", query);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status, query }, "Prometheus vector query failed");
      return [];
    }

    const json = (await res.json()) as {
      status: string;
      data: {
        resultType: string;
        result: Array<{ metric: Record<string, string>; value: [number, string] }>;
      };
    };

    if (json.status !== "success") return [];

    return json.data.result.map((r) => ({
      metric: r.metric,
      value: parseFloat(r.value[1]),
    }));
  } catch (err) {
    logger.warn({ err, query }, "Prometheus vector query error");
    return [];
  }
}

logger.info({ url: PROMETHEUS_URL }, "Prometheus client initialized");
