import https from "node:https";
import fs from "node:fs";
import { logger } from "./logger";

const K8S_API_URL = `https://${process.env.KUBERNETES_SERVICE_HOST ?? "kubernetes.default.svc"}:${process.env.KUBERNETES_SERVICE_PORT ?? "443"}`;
const TOKEN_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/token";
const CA_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt";

export function isInCluster(): boolean {
  return fs.existsSync(TOKEN_PATH);
}

function k8sRequest<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = fs.readFileSync(TOKEN_PATH, "utf-8").trim();
    const ca = fs.readFileSync(CA_PATH);
    const url = new URL(path, K8S_API_URL);

    const req = https.request(
      {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        ca,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(`K8s API error ${res.statusCode}: ${JSON.stringify(body)}`));
            } else {
              resolve(body as T);
            }
          } catch (err) {
            reject(err);
          }
        });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

export async function k8sGet<T>(path: string): Promise<T> {
  if (!isInCluster()) {
    throw new Error("Not running in cluster");
  }
  return k8sRequest<T>(path);
}

export interface K8sNodeList {
  items: K8sNode[];
}

export interface K8sNode {
  metadata: { name: string; creationTimestamp: string };
  status: {
    conditions: Array<{ type: string; status: string }>;
    nodeInfo: { kubeletVersion: string; osImage: string };
    capacity: { cpu: string; memory: string };
    allocatable: { cpu: string; memory: string };
  };
}

export interface K8sNamespaceList {
  items: Array<{
    metadata: { name: string; creationTimestamp: string };
    status: { phase: string };
  }>;
}

export interface K8sPodList {
  items: K8sPod[];
}

export interface K8sPod {
  metadata: { name: string; namespace: string; creationTimestamp: string };
  spec: { nodeName: string };
  status: {
    phase: string;
    containerStatuses?: Array<{ restartCount: number }>;
  };
}

export interface K8sDeploymentList {
  items: K8sDeployment[];
}

export interface K8sDeployment {
  metadata: { name: string; namespace: string; creationTimestamp: string };
  spec: { replicas: number };
  status: {
    readyReplicas?: number;
    availableReplicas?: number;
    updatedAt?: string;
    conditions?: Array<{ lastUpdateTime?: string }>;
  };
}

export interface K8sVersionInfo {
  gitVersion: string;
}

export interface K8sArgoCdAppList {
  items: K8sArgoCdApp[];
}

export interface K8sArgoCdApp {
  metadata: { name: string };
  spec: {
    source: { repoURL: string; targetRevision: string };
    destination: { namespace: string };
  };
  status: {
    sync: { status: string; finishedAt?: string };
    health: { status: string };
  };
}

export function getNodeRoles(node: K8sNode): string[] {
  return [];
}

export function isNodeReady(node: K8sNode): boolean {
  const readyCond = node.status.conditions.find((c) => c.type === "Ready");
  return readyCond?.status === "True";
}

export function getPodRestarts(pod: K8sPod): number {
  const statuses = pod.status.containerStatuses ?? [];
  return statuses.reduce((sum, cs) => sum + cs.restartCount, 0);
}

logger.info({ url: K8S_API_URL }, "Kubernetes client initialized");
