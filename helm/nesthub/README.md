# NestHub Helm chart

Deploys the whole NestHub stack: NestJS API, Next.js web and PostgreSQL. It creates the same set of objects as the plain manifests in [`k8s/`](../../k8s), but every name, image tag, replica count and setting comes from values.

```
helm/nesthub/
├── Chart.yaml
├── values.yaml            # defaults = development
├── values-dev.yaml        # development overrides
├── values-prod.yaml       # production overrides
└── templates/
    ├── _helpers.tpl       # names, labels, image, secret helpers
    ├── NOTES.txt          # printed after install / upgrade
    ├── configmap.yaml
    ├── secret.yaml
    ├── postgres-pvc.yaml  # only when postgres.persistence.enabled
    ├── postgres-deployment.yaml
    ├── postgres-service.yaml
    ├── api-deployment.yaml
    ├── api-service.yaml
    ├── web-deployment.yaml
    ├── web-service.yaml
    ├── ingress.yaml       # only when ingress.enabled
    ├── hook-pre-upgrade-db-check.yaml
    └── tests/test-connection.yaml
```

## `version` vs `appVersion`

| Field | Value | Meaning in this project |
| ----- | ----- | ----------------------- |
| `version` | `0.1.0` | Version of the **chart**: templates, values and defaults. Bump it whenever the chart changes, even if the application does not. |
| `appVersion` | `1.4.0` | Version of the **application** (the `nesthub-api` / `nesthub-web` images built by CI from git tags `vX.Y.Z`). It is the image tag used when `api.image.tag` / `web.image.tag` are empty, and it is shown in `helm list`. |

So a fix in a template is a new `version` with the same `appVersion`, and a new app release is a new `appVersion` (and usually a new `version` too).

## Install

```bash
# Development: 1 replica each, NodePort, no Ingress
helm install nesthub helm/nesthub -n nesthub --create-namespace -f helm/nesthub/values-dev.yaml

# Production: 3 API / 2 web replicas, bigger resources, image 1.4.0, Ingress on nesthub.local
helm install nesthub helm/nesthub -n nesthub --create-namespace -f helm/nesthub/values-prod.yaml
```

Then follow the instructions that `NOTES.txt` prints, and check the release with `helm test nesthub -n nesthub`.

Object names are built from the release name (`<release>-nesthub-api`, or `nesthub-api` when the release is called `nesthub`), so the chart can be installed several times in one cluster, even in one namespace:

```bash
helm install demo helm/nesthub -n nesthub
```

## Values

| Key | Default (dev) | Prod | Description |
| --- | ------------- | ---- | ----------- |
| `nameOverride` / `fullnameOverride` | `""` | | Override the chart / full name used in object names. |
| `api.replicaCount` | `1` | `3` | API pods. |
| `api.image.repository` | `ghcr.io/corenest-chnu/nesthub-api` | | API image. |
| `api.image.tag` | `1.3.0` | `1.4.0` | API image tag; empty = `appVersion`. |
| `api.image.pullPolicy` | `IfNotPresent` | | |
| `api.service.type` / `api.service.port` | `ClusterIP` / `8000` | | API Service. |
| `api.resources` | 100m / 192Mi → 500m / 512Mi | 250m / 256Mi → 1 / 768Mi | Requests → limits. |
| `web.replicaCount` | `1` | `2` | Web pods. |
| `web.image.repository` | `ghcr.io/corenest-chnu/nesthub-web` | | Web image. |
| `web.image.tag` | `1.3.0` | `1.4.0` | Web image tag; empty = `appVersion`. |
| `web.service.type` | `NodePort` | `ClusterIP` | Web Service type. |
| `web.service.port` | `3000` | | |
| `web.service.nodePort` | `30081` (dev file) | | Fixed node port; empty = assigned by Kubernetes. |
| `web.resources` | 50m / 128Mi → 500m / 384Mi | 100m / 192Mi → 1 / 512Mi | Requests → limits. |
| `postgres.image.repository` / `tag` | `postgres` / `17-alpine` | | |
| `postgres.resources` | 100m / 128Mi → 500m / 512Mi | 250m / 256Mi → 1 / 1Gi | Requests → limits. |
| `postgres.persistence.enabled` | `true` | | `false` = `emptyDir`, data is lost with the pod. |
| `postgres.persistence.size` | `1Gi` | | PVC size. |
| `postgres.persistence.storageClass` | `""` | | Empty = default StorageClass. |
| `ingress.enabled` | `false` | `true` | Create the Ingress. |
| `ingress.className` / `ingress.host` | `nginx` / `nesthub.local` | | |
| `config.postgresDb` / `config.postgresUser` | `nesthub` / `nesthub` | | ConfigMap. |
| `config.nodeEnv` | `production` | | ConfigMap, API `NODE_ENV`. |
| `config.jwtExpiresIn` | `86400` | | ConfigMap, JWT lifetime in seconds. |
| `config.authTrustHost` | `true` | | ConfigMap, NextAuth `AUTH_TRUST_HOST`. |
| `secrets.postgresPassword`, `secrets.jwtSecret`, `secrets.staticSalt`, `secrets.authSecret` | `""` | | Secret. Empty = random value on first install, kept on upgrades. Never commit real values; pass them with `--set` if needed. |
| `hooks.preUpgradeDbCheck.enabled` | `true` | | `pre-upgrade` Job that checks the database before an upgrade. |
| `tests.image` | `curlimages/curl:8.16.0` | | Image of the `helm test` pod. |

The web pods get `API_PROXY_TARGET=http://<release>-api:8000` from the ConfigMap. The web image reads it at runtime (`apps/web/src/proxy.ts`), so the same image works with any release name.

## Value priority

From lowest to highest; a later source overrides an earlier one, key by key:

1. `values.yaml` of the chart;
2. `-f` / `--values` files, in the order given (`-f a.yaml -f b.yaml`: `b` wins);
3. `--set` / `--set-string` flags.

Example: `-f values-dev.yaml --set api.image.tag=1.4.0` runs the dev settings with API `1.4.0`.

On `helm upgrade`, values from the previous revision are **not** kept unless `--reuse-values` is passed: the release is rendered again from `values.yaml` + the files and flags of that command.

## Compare environments without installing

```bash
diff -u \
  <(helm template nesthub helm/nesthub -f helm/nesthub/values-dev.yaml) \
  <(helm template nesthub helm/nesthub -f helm/nesthub/values-prod.yaml)
```

The Secret values differ on every render (they are random when nothing is installed), so ignore those lines.

## Release lifecycle

```bash
helm lint helm/nesthub
helm template nesthub helm/nesthub -f helm/nesthub/values-dev.yaml   # rendered manifests
helm install nesthub helm/nesthub -n nesthub --create-namespace -f helm/nesthub/values-dev.yaml
helm list -n nesthub
helm status nesthub -n nesthub
helm get values nesthub -n nesthub          # values the release was installed with
kubectl -n nesthub get secret -l owner=helm # where Helm stores release state

helm upgrade nesthub helm/nesthub -n nesthub -f helm/nesthub/values-dev.yaml --set api.image.tag=1.4.0
helm upgrade nesthub helm/nesthub -n nesthub -f helm/nesthub/values-prod.yaml
helm history nesthub -n nesthub
helm rollback nesthub 2 -n nesthub
helm test nesthub -n nesthub

helm uninstall nesthub -n nesthub
kubectl -n nesthub get all,pvc,configmap,secret,ingress
```

Helm stores each revision as a Secret `sh.helm.release.v1.<release>.v<N>` in the release namespace. The Secret holds the gzipped chart, values and rendered manifest.

## Hook and test

- **`pre-upgrade` hook** (`templates/hook-pre-upgrade-db-check.yaml`): a Job that Helm runs before changing any object on `helm upgrade`. It waits for PostgreSQL to accept connections, and the upgrade is aborted if the database is unreachable, because new API pods run migrations on start. The Job is deleted when it succeeds.
- **Test** (`templates/tests/test-connection.yaml`): `helm test nesthub` starts a pod that goes through the whole chain: web Service → Next.js proxy → API → PostgreSQL (`/api/health`, `/api/health/ready`, `/catalog`). The pod is deleted when it succeeds.
