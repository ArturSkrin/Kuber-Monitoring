import { Router, type IRouter } from "express";
import { lokiQueryRange } from "../lib/loki";
import { mockLogsSummary } from "../lib/mockdata";
import { GetLogsSummaryResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const SAFE_MSG_PATTERNS = [
  /connection refused/i,
  /liveness probe failed/i,
  /readiness probe failed/i,
  /back-off restarting/i,
  /oom killed/i,
  /crash loop/i,
  /failed to pull image/i,
  /failed to scrape/i,
  /error.*timeout/i,
  /dial.*refused/i,
];

function sanitizeMessage(msg: string): string | null {
  const lower = msg.toLowerCase();
  for (const pat of SAFE_MSG_PATTERNS) {
    if (pat.test(lower)) {
      return msg.substring(0, 120);
    }
  }
  return null;
}

router.get("/logs/summary", async (req, res): Promise<void> => {
  try {
    const streams = await lokiQueryRange(
      `{namespace=~"eve|argocd|monitoring|logging|kube-system"} |= "error"`,
      200,
      "1h",
    );

    if (streams.length === 0) {
      req.log.info("Loki returned no results — returning mock logs summary");
      res.json(GetLogsSummaryResponse.parse(mockLogsSummary));
      return;
    }

    const namespaceCounts = new Map<string, number>();
    const podCounts = new Map<string, { pod: string; namespace: string; count: number }>();
    const recentMessages: string[] = [];

    for (const stream of streams) {
      const ns = stream.stream.namespace ?? "unknown";
      const pod = stream.stream.pod ?? stream.stream.app ?? "unknown";
      const podKey = `${ns}/${pod}`;

      namespaceCounts.set(ns, (namespaceCounts.get(ns) ?? 0) + stream.values.length);

      if (!podCounts.has(podKey)) {
        podCounts.set(podKey, { pod, namespace: ns, count: 0 });
      }
      const entry = podCounts.get(podKey)!;
      entry.count += stream.values.length;

      for (const [, line] of stream.values.slice(0, 5)) {
        if (recentMessages.length < 5) {
          const safe = sanitizeMessage(line);
          if (safe) recentMessages.push(safe);
        }
      }
    }

    const totalErrors = Array.from(namespaceCounts.values()).reduce((a, b) => a + b, 0);
    const namespacesWithErrors = Array.from(namespaceCounts.keys());
    const topPodsWithErrors = Array.from(podCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json(
      GetLogsSummaryResponse.parse({
        totalErrors,
        namespacesWithErrors,
        topPodsWithErrors,
        recentMessages,
      }),
    );
  } catch (err) {
    logger.error({ err }, "Failed to fetch Loki log summary, using mock");
    res.json(GetLogsSummaryResponse.parse(mockLogsSummary));
  }
});

export default router;
