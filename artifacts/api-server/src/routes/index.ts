import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clusterRouter from "./cluster";
import metricsRouter from "./metrics";
import argocdRouter from "./argocd";
import logsRouter from "./logs";
import servicesRouter from "./services";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clusterRouter);
router.use(metricsRouter);
router.use(argocdRouter);
router.use(logsRouter);
router.use(servicesRouter);

export default router;
