import { logger } from "./logger";

const LOKI_URL = process.env.LOKI_URL ?? "http://loki-gateway.logging.svc.cluster.local";

interface LokiStreamEntry {
  stream: Record<string, string>;
  values: Array<[string, string]>;
}

interface LokiQueryResponse {
  status: string;
  data: {
    resultType: string;
    result: LokiStreamEntry[];
  };
}

export async function lokiQueryRange(
  logql: string,
  limit = 200,
  since = "1h",
): Promise<LokiStreamEntry[]> {
  try {
    const url = new URL("/loki/api/v1/query_range", LOKI_URL);
    const now = Date.now();
    url.searchParams.set("query", logql);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("start", String((now - parseSince(since)) * 1_000_000));
    url.searchParams.set("end", String(now * 1_000_000));
    url.searchParams.set("direction", "backward");

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status, logql }, "Loki query failed");
      return [];
    }

    const json = (await res.json()) as LokiQueryResponse;
    if (json.status !== "success") return [];
    return json.data.result;
  } catch (err) {
    logger.warn({ err, logql }, "Loki query error");
    return [];
  }
}

function parseSince(since: string): number {
  const unit = since.slice(-1);
  const val = parseInt(since.slice(0, -1), 10);
  switch (unit) {
    case "m":
      return val * 60 * 1000;
    case "h":
      return val * 60 * 60 * 1000;
    case "d":
      return val * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
}

logger.info({ url: LOKI_URL }, "Loki client initialized");
