---
title: Persistence and Updates
description: Persist the enrolled engine identity across restarts with a state volume, and update the container by rolling the image tag.
sidebar:
  order: 4
---

This guide covers two operational concerns for the engine container: keeping the
enrolled identity across restarts, and moving to a newer engine version.

## 1. The state volume

The engine keeps its enrolled identity in its state directory,
`/var/lib/vacti-engine` (the image default `ENGINE_STATE_DIR`). If you do not
mount anything there, Docker still creates an anonymous volume, but that is easy
to lose track of and is not reused when you recreate the container. Mount a named
volume so the identity is durable and obvious:

```bash
docker run -d \
  --name vacti-engine \
  --restart unless-stopped \
  -e VACTI_URL="https://cp.example.internal" \
  -e VACTI_ENROLL_TOKEN="<single-use-enroll-token>" \
  -v vacti-engine-state:/var/lib/vacti-engine \
  ghcr.io/anggipradana/vacti-distro:latest
```

In Compose this is the `vacti-engine-state` named volume shown in the Compose
guide.

## 2. How persistence affects restarts

If the state volume is mounted and the engine has already enrolled, a restart
comes back online with no new enrollment: the engine reuses the identity on the
volume. You only supply a fresh enrollment token again if the engine has not
enrolled yet, or if the persisted identity is no longer valid.

## 3. Backing up or inspecting the volume

The volume holds the enrolled identity. To see where Docker stores it or to back
it up:

```bash
docker volume inspect vacti-engine-state
```

To copy the state out to the host for a backup (the file is 0600 inside the
container, so run as root in a helper container):

```bash
docker run --rm \
  -v vacti-engine-state:/state:ro \
  -v "$PWD":/backup \
  debian:trixie-slim \
  cp /state/engine.env /backup/engine.env.bak
```

Treat that file as a secret: it contains the engine's enrolled identity.

## 4. Updates: roll the image tag

The recommended update path for the container is to pull a newer image and
recreate the container. Because the enrolled identity lives on the state volume,
the new container reuses it and does not need to re-enroll.

### With docker run

```bash
docker pull ghcr.io/anggipradana/vacti-distro:latest
docker stop vacti-engine
docker rm vacti-engine
docker run -d \
  --name vacti-engine \
  --restart unless-stopped \
  -e VACTI_URL="https://cp.example.internal" \
  -v vacti-engine-state:/var/lib/vacti-engine \
  ghcr.io/anggipradana/vacti-distro:latest
```

Note that on this recreate you do not need to pass `VACTI_ENROLL_TOKEN` again:
the enrolled identity on the volume is reused. You only supply a fresh enrollment
token if the persisted identity is no longer valid.

### With Compose

```bash
docker compose pull
docker compose up -d
```

Compose recreates the service with the newer image and keeps the named volume.

## 5. Pin versions for predictable updates

`:latest` moves whenever a new engine is published. For predictable updates, pin
a versioned tag and bump it deliberately:

```yaml
    image: ghcr.io/anggipradana/vacti-distro:0.2.427
```

To update, change the tag to the new version, then `docker compose pull` and
`docker compose up -d`. This makes the engine version an explicit, reviewable
change rather than an implicit one.

## 6. The in-image auto-update knob

The image sets `VACTI_AUTO_UPDATE=0`. For containers the recommended update path
is rolling the image tag (above): pull a newer tag and recreate the container,
rather than updating the engine in place inside an otherwise immutable image
layer.

Leave `VACTI_AUTO_UPDATE=0` unless you have a specific reason to change it, and
update by pulling a new tag.

## 7. Restart policy and health instead of a watchdog

A container has no systemd. The appliance relies on the systemd unit's watchdog
and restart logic; the container replaces that with two Docker mechanisms:

1. A restart policy (`--restart unless-stopped`, or `restart: unless-stopped` in
   Compose) brings the container back if the engine process exits.
2. The image HEALTHCHECK watches the engine process every 30 seconds,
   with a 180 second start period and 4 retries before marking the container
   unhealthy.

Together these approximate the appliance's watchdog: the restart policy recovers
a crashed or exited engine, and the HEALTHCHECK surfaces an unhealthy engine to
you or your orchestrator. Note that plain `docker run` does not itself restart a
container merely because its HEALTHCHECK reports unhealthy; the restart policy
acts on process exit.

## 8. A clean reset

To force the engine to enroll from scratch (new identity), remove the state
volume and start again with a fresh enroll token:

```bash
docker rm -f vacti-engine
docker volume rm vacti-engine-state
docker run -d \
  --name vacti-engine \
  --restart unless-stopped \
  -e VACTI_URL="https://cp.example.internal" \
  -e VACTI_ENROLL_TOKEN="<fresh-single-use-enroll-token>" \
  -v vacti-engine-state:/var/lib/vacti-engine \
  ghcr.io/anggipradana/vacti-distro:latest
```

This discards the persisted tokens, so the next start performs a full enroll
exchange against the control plane.
