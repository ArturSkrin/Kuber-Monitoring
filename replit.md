# Kubernetes Homelab Portfolio Dashboard

A public read-only portfolio dashboard that shows the live status of a Kubernetes homelab — cluster health, nodes, pods, deployments, ArgoCD GitOps apps, Prometheus metrics, Loki log summaries, and public service health checks.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/portfolio run dev` — run the frontend dashboard
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- No database required — data comes from Kubernetes API, Prometheus, Loki, ArgoCD CRDs

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Recharts
- API: Express 5 (serves both API and static files in production)
- No DB — all data is live from Kubernetes API, Prometheus HTTP API, Loki HTTP API
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `artifacts/api-server/src/routes/` — backend route handlers
- `artifacts/api-server/src/lib/k8s.ts` — Kubernetes in-cluster client
- `artifacts/api-server/src/lib/prometheus.ts` — Prometheus HTTP API client
- `artifacts/api-server/src/lib/loki.ts` — Loki HTTP API client
- `artifacts/api-server/src/lib/mockdata.ts` — fallback mock data (used when not in-cluster)
- `artifacts/portfolio/src/` — React frontend dashboard
- `k8s/` — Kubernetes manifests for ArgoCD deployment
- `Dockerfile` — single-container build (frontend + API)

## Architecture decisions

- **No public exposure of internal services** — browser only calls our own `/api` backend; Kubernetes/Prometheus/Loki/ArgoCD are never exposed directly
- **Mock data fallback** — when running outside a Kubernetes cluster (dev, Replit), all integrations gracefully fall back to static mock data so the UI always renders
- **In-cluster ServiceAccount auth** — reads token from `/var/run/secrets/kubernetes.io/serviceaccount/token`; no kubeconfig needed
- **ArgoCD via Kubernetes CRD API** — reads `argoproj.io/v1alpha1/applications` from the K8s API rather than requiring the ArgoCD server to be publicly exposed
- **Single container in production** — Express serves both `/api/*` routes and the built React static files; the Dockerfile builds both and serves from one container on port 3000

## Product

- Real-time cluster status: nodes ready, pods running/pending/failed, deployment readiness
- Prometheus metrics: cluster CPU/memory, per-node metrics, pod phase breakdown, restart leaderboard
- ArgoCD apps: sync status and health per application
- Loki logs: sanitized error summary (counts only, no raw sensitive logs)
- Public service health: live HTTP checks for evetools.skrin.pp.ua and portfolio.skrin.pp.ua
- Stack overview section: cards explaining each technology
- Auto-refreshes all data every 30 seconds

## Kubernetes Deployment (via ArgoCD)

1. Update `k8s/deployment.yaml` — replace `YOUR_GITHUB_USERNAME` with your GitHub username
2. Update `k8s/argocd-application.yaml` — replace `YOUR_GITHUB_USERNAME` with your repo
3. Apply RBAC first: `kubectl apply -f k8s/namespace.yaml -f k8s/serviceaccount.yaml -f k8s/clusterrole.yaml -f k8s/clusterrolebinding.yaml`
4. Build and push Docker image: `docker build -t ghcr.io/YOUR_GITHUB_USERNAME/portfolio:latest . && docker push ...`
5. Apply remaining manifests: `kubectl apply -f k8s/`
6. Or let ArgoCD manage it via `k8s/argocd-application.yaml`

Namespace: `portfolio`  
Ingress host: `portfolio.skrin.pp.ua`  
TLS: cert-manager with `letsencrypt-cloudflare` cluster issuer

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The API server uses `pino` logger — never use `console.log` in server code
- When making changes to the OpenAPI spec, always re-run codegen before building the frontend
- The `lib/db` package requires `DATABASE_URL` — but this app doesn't use a DB, so make sure nothing imports from `@workspace/db`
- Static file serving in Express is only active when `NODE_ENV=production`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
