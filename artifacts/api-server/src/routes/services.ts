import { Router, type IRouter } from "express";
import { GetPublicServicesResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

interface PublicService {
  name: string;
  url: string;
}

const PUBLIC_SERVICES: PublicService[] = [
  {
    name: "Eve Online Tools",
    url: process.env.PUBLIC_EVE_URL ?? "https://evetools.skrin.pp.ua",
  },
  {
    name: "Portfolio Dashboard",
    url: process.env.PUBLIC_PORTFOLIO_URL ?? "https://portfolio.skrin.pp.ua",
  },
];

async function checkService(
  svc: PublicService,
): Promise<{ name: string; url: string; status: string; httpStatus: number; latencyMs: number }> {
  const start = Date.now();
  try {
    const res = await fetch(svc.url, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    const latencyMs = Date.now() - start;
    return {
      name: svc.name,
      url: svc.url,
      status: res.ok ? "up" : "degraded",
      httpStatus: res.status,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    logger.warn({ err, url: svc.url }, "Service health check failed");
    return {
      name: svc.name,
      url: svc.url,
      status: "down",
      httpStatus: 0,
      latencyMs,
    };
  }
}

router.get("/public-services", async (req, res): Promise<void> => {
  try {
    const results = await Promise.all(PUBLIC_SERVICES.map(checkService));
    res.json(GetPublicServicesResponse.parse(results));
  } catch (err) {
    logger.error({ err }, "Failed to check public services");
    res.json(
      GetPublicServicesResponse.parse(
        PUBLIC_SERVICES.map((svc) => ({
          name: svc.name,
          url: svc.url,
          status: "unknown",
          httpStatus: 0,
          latencyMs: 0,
        })),
      ),
    );
  }
});

export default router;
