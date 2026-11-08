---
title: Pull and Run
description: Pull the universal multi-arch Vacti engine image from GHCR and start a container that activates against your control plane.
sidebar:
  order: 1
---

Vacti ships a universal container image that reproduces the same engine as the
OVA appliance, packaged for `docker run`. There is no OS login: it is
a container, and the engine runs as root inside it. You point the container at
your control plane and hand it a license token at run time. No secret is baked
into the image.

## 1. The image

The image is published to the GitHub Container Registry:

```
ghcr.io/anggipradana/vacti-distro:latest
```

Versioned tags are published alongside `latest`. The publish step tags each
build as both `:latest` and `:<version>` (for example `:0.2.427`), where the
version is the pinned engine release the image was built against:

```
ghcr.io/anggipradana/vacti-distro:latest
ghcr.io/anggipradana/vacti-distro:0.2.427
```

Pin a versioned tag for reproducible deployments; use `:latest` only when you
want whatever the most recent published engine is.

## 2. Architectures

The image is multi-arch, covering two platforms:

- `linux/amd64`
- `linux/arm64`

`docker pull` automatically selects the one that matches your host. An Apple
Silicon or arm64 server pulls arm64 with no emulation; an x86 host pulls amd64.

## 3. The image carries no secret

The published image is switched off until you activate it: it carries no
enrollment token, no engine token, and no private credential, exactly like the
disk images. The license arrives per run at enrollment time, so the same image
is safe to pull and reuse.

## 4. Pull the image

```bash
docker pull ghcr.io/anggipradana/vacti-distro:latest
```

If your registry access requires a login, authenticate to GHCR first with a
GitHub token that can read the package:

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u <your-github-user> --password-stdin
docker pull ghcr.io/anggipradana/vacti-distro:latest
```

## 5. Run the container

The container needs two things at run time: the base URL of your control plane,
and a single-use enrollment token minted by that control plane. Both are passed
as environment variables. Nothing is written to the image.

```bash
docker run -d \
  --name vacti-engine \
  --restart unless-stopped \
  -e VACTI_URL="https://<your-control-plane>" \
  -e VACTI_ENROLL_TOKEN="<single-use-enroll-token>" \
  -v vacti-engine-state:/var/lib/vacti-engine \
  ghcr.io/anggipradana/vacti-distro:latest
```

What each flag does:

1. `-e VACTI_URL` is the control-plane base URL the engine enrolls against and
   then talks to. It is required.
2. `-e VACTI_ENROLL_TOKEN` is the single-use enrollment token the engine uses to
   enroll on first start. It is short-lived; mint a fresh one if it expires.
3. `-v vacti-engine-state:/var/lib/vacti-engine` mounts a named volume at the
   engine state directory so the enrolled identity survives a restart. See the
   persistence guide for why this matters.
4. `--restart unless-stopped` is recommended: a container has no systemd
   watchdog, so Docker's restart policy brings the engine back if its process
   exits, and the image HEALTHCHECK reports whether the runner is alive.

## 6. What happens on first start

The container follows the same first-boot flow as the appliance. On first start
it:

1. Reads `VACTI_URL`.
2. Activates against your control plane. The container is inert until you supply
   both `VACTI_URL` and a valid token: the entrypoint cannot enroll the engine
   without them, and will exit with a clear message if either is missing. See
   [How your engine stays protected](/architecture/02-ip-protection/).
3. Enrolls against the control plane using `VACTI_ENROLL_TOKEN`. The token itself
   is never logged.
4. Stores the enrolled identity under `/var/lib/vacti-engine` so a restart comes
   back authenticated without re-enrolling.
5. Prepares the browser used for evidence capture.
6. Runs the engine.

If the enroll call fails (for example an expired or already-used token) the
container exits with a clear message. Re-mint a fresh token and run again.

## 7. No inbound port

The engine connects to the control plane outbound only and does not listen on any
inbound port, so there is nothing to publish with `-p`. All you need is outbound
network access from the container to your control plane.

## 8. Confirm it is running

```bash
docker ps --filter name=vacti-engine
docker logs -f vacti-engine
```

The image defines a HEALTHCHECK that watches for the engine process,
with a 180 second start period before the first check.
Once the engine has reached the control plane and claimed work, `docker ps`
reports the container as healthy.

## 9. Stopping

```bash
docker stop vacti-engine
```

The image sets `STOPSIGNAL SIGTERM`, and the engine traps SIGTERM for a graceful
finish-the-tick shutdown, mirroring the systemd unit. Give it a moment to drain
before force-killing.
