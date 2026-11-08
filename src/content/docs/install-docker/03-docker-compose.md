---
title: Docker Compose
description: A minimal single-service Compose file for the Vacti engine container, with a persistent volume and run-time enrollment.
sidebar:
  order: 3
---

Compose is convenient for pinning the image, the volume, and the environment in
one file you can version-control. This guide shows a minimal Compose setup for
the engine container.

## 1. One service only

The Compose file below defines a single service: `vacti-engine`. The control
plane is not part of this image and does not run here. The control plane is the
Vacti web application, which is a separate repository and a separate image, and
it runs elsewhere (your existing Vacti deployment). This container is only the
engine, and it reaches that control plane outbound over the network.

So there is exactly one service in this file. `VACTI_URL` points at wherever your
control plane already lives.

## 2. Minimal compose.yml

```yaml
services:
  vacti-engine:
    image: ghcr.io/anggipradana/vacti-distro:latest
    container_name: vacti-engine
    restart: unless-stopped
    environment:
      VACTI_URL: "https://cp.example.internal"
      VACTI_ENROLL_TOKEN: "${VACTI_ENROLL_TOKEN}"
    volumes:
      - vacti-engine-state:/var/lib/vacti-engine

volumes:
  vacti-engine-state:
```

Notes on this file:

1. `image` pins the engine image. For reproducible deployments, replace
   `:latest` with a versioned tag such as `:0.2.427`.
2. `restart: unless-stopped` gives the container a restart policy. A container
   has no systemd watchdog, so the restart policy plus the image HEALTHCHECK
   replace the appliance's watchdog behavior.
3. `VACTI_URL` is the base URL of your already-running control plane.
4. `VACTI_ENROLL_TOKEN` is read from the shell environment with
   `${VACTI_ENROLL_TOKEN}` so the single-use token is not committed to the file.
5. The named volume `vacti-engine-state` is mounted at `/var/lib/vacti-engine`
   so the enrolled identity persists across restarts.

There is deliberately no `ports:` section. The engine listens on no inbound
port; it only makes outbound connections to the control plane. There is nothing
to publish.

## 3. Supply the enroll token

Keep the single-use token out of the Compose file. Pass it through the
environment when you bring the stack up:

```bash
export VACTI_ENROLL_TOKEN="<single-use-enroll-token>"
docker compose up -d
```

Or put it in a local `.env` file next to `compose.yml` (Compose loads it
automatically) and keep that file out of version control:

```bash
# .env  (do not commit)
VACTI_ENROLL_TOKEN=<single-use-enroll-token>
```

```bash
docker compose up -d
```

## 4. Bring it up and watch it enroll

```bash
docker compose up -d
docker compose logs -f vacti-engine
```

On first start the engine enrolls against the control plane, persists its
enrolled identity to the mounted volume, and starts. If the token is expired or
already used, the container exits with a clear message; re-mint a fresh token,
update the environment, and run `docker compose up -d` again.

## 5. Using a pre-provisioned token instead

If you already hold an engine token rather than using the single-use enrollment
flow, swap the environment block:

```yaml
    environment:
      VACTI_URL: "https://cp.example.internal"
      VACTI_TOKEN: "${VACTI_TOKEN}"
```

With `VACTI_TOKEN` set, the engine uses that token directly and does not enroll.
Supply exactly one of `VACTI_ENROLL_TOKEN` or `VACTI_TOKEN`.

## 6. Pinning a version and a stable engine id

For a production service you usually want a pinned image and a recognizable
engine id:

```yaml
services:
  vacti-engine:
    image: ghcr.io/anggipradana/vacti-distro:0.2.427
    container_name: vacti-engine
    restart: unless-stopped
    environment:
      VACTI_URL: "https://cp.example.internal"
      VACTI_ENROLL_TOKEN: "${VACTI_ENROLL_TOKEN}"
      ENGINE_ID: "vacti-engine-prod-1"
    volumes:
      - vacti-engine-state:/var/lib/vacti-engine

volumes:
  vacti-engine-state:
```

`ENGINE_ID` is optional; without it the engine uses the container hostname.

## 7. Lifecycle commands

```bash
# Start or update the stack
docker compose up -d

# Follow logs
docker compose logs -f vacti-engine

# Stop (SIGTERM, graceful finish-the-tick shutdown)
docker compose stop

# Stop and remove the container (the named volume is kept)
docker compose down

# Remove the container AND the state volume (forces a fresh enroll next time)
docker compose down -v
```

Be careful with `docker compose down -v`: it deletes the `vacti-engine-state`
volume, which discards the persisted enrollment. The next start will need a fresh
enroll token. See the persistence and updates guide.
