import { Router, type IRouter } from "express";
import { k8sGet, isInCluster, type K8sArgoCdAppList } from "../lib/k8s";
import { mockArgoCdApps } from "../lib/mockdata";
import { GetArgoCdAppsResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const ARGOCD_NAMESPACE = process.env.ARGOCD_NAMESPACE ?? "argocd";

const router: IRouter = Router();

router.get("/argocd/apps", async (req, res): Promise<void> => {
  if (!isInCluster()) {
    req.log.info("Not in cluster — returning mock ArgoCD apps");
    res.json(GetArgoCdAppsResponse.parse(mockArgoCdApps));
    return;
  }

  try {
    const appList = await k8sGet<K8sArgoCdAppList>(
      `/apis/argoproj.io/v1alpha1/namespaces/${ARGOCD_NAMESPACE}/applications`,
    );

    const apps = (appList.items ?? []).map((app) => ({
      name: app.metadata.name,
      syncStatus: app.status?.sync?.status ?? "Unknown",
      healthStatus: app.status?.health?.status ?? "Unknown",
      repoUrl: app.spec?.source?.repoURL ?? "",
      targetRevision: app.spec?.source?.targetRevision ?? "HEAD",
      destinationNamespace: app.spec?.destination?.namespace ?? "",
      lastSyncTime: app.status?.sync?.finishedAt ?? null,
    }));

    res.json(GetArgoCdAppsResponse.parse(apps.length > 0 ? apps : mockArgoCdApps));
  } catch (err) {
    logger.error({ err }, "Failed to fetch ArgoCD apps from K8s CRD, using mock");
    res.json(GetArgoCdAppsResponse.parse(mockArgoCdApps));
  }
});

export default router;
