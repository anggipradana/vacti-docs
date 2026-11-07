---
title: Environment Variables
description: The run-time and image environment variables the Vacti container accepts, with what each one does and which are required.
sidebar:
  order: 2
---

The container is configured entirely through environment variables. There are
two groups: the per-run inputs you supply at `docker run` (never baked into the
image), and the image defaults already set in the Dockerfile. Only variables that
actually appear in the image source are listed here.

## 1. Per-run inputs

These are read by the container entrypoint on start. They are supplied at
`docker run` time and are never stored in the image.

| Variable | Aliases | Required | Purpose |
| --- | --- | --- | --- |
| `VACTI_URL` | `CP_URL` | Yes | Control-plane base URL the engine enrolls against and then talks to. |
| `VACTI_ENROLL_TOKEN` | `ENROLL_TOKEN` | One of these two | Single-use enrollment token the engine uses to enroll on first start. |
| `VACTI_TOKEN` | | One of these two | A pre-provisioned engine token. When supplied, the engine uses it directly and skips enrollment. |
| `ENGINE_ID` | | No | Identifier reported for this engine. Defaults to the container hostname. |

### VACTI_URL

The base URL of your control plane, for example
`https://cp.example.internal`. A trailing slash is normalized for you. You can set
it with either `VACTI_URL` or the `CP_URL` alias; `VACTI_URL` wins if both are set.
This value is required. If it is missing the container exits with a fatal error.

```bash
-e VACTI_URL="https://cp.example.internal"
```

### VACTI_ENROLL_TOKEN

The normal path. This is the single-use enrollment token minted by the control
plane. On first start the engine uses it to enroll and persists the resulting
engine identity to the state volume. You can pass it as `VACTI_ENROLL_TOKEN` or
the `ENROLL_TOKEN` alias.

```bash
-e VACTI_ENROLL_TOKEN="<single-use-enroll-token>"
```

If enrollment fails (expired or already-used token) the container exits with a
message telling you to re-mint and retry.

### VACTI_TOKEN

An alternative to enrollment. If you already hold an engine token and set
`VACTI_TOKEN`, the engine uses it directly and does not enroll. The enrollment
flow is the normal path for most deployments.

```bash
-e VACTI_TOKEN="<engine-token>"
```

You must supply either `VACTI_TOKEN` or `VACTI_ENROLL_TOKEN` (or have a persisted
token already on the state volume from a prior run). With none of these, the
container exits because it has no way to authenticate.

### ENGINE_ID

Optional. The identifier the engine presents during enrollment. If unset it
defaults to the container's short hostname. Set it when you want a stable,
recognizable engine id regardless of the container's generated hostname.

```bash
-e ENGINE_ID="vacti-engine-prod-1"
```

## 2. The enrolled identity on the state volume

You do not set these. When enrollment succeeds, the engine persists its enrolled
identity under `/var/lib/vacti-engine` on the state volume. On a later restart it
reuses that persisted identity instead of enrolling again, which is why mounting a
volume at the state directory matters. Back up or move that volume to move an
enrolled engine; delete it to force a fresh enrollment.

## 3. Image defaults you can override

The image ships with sensible defaults, so you normally only set the per-run
inputs above. Two defaults are worth knowing because you may want to change them:

| Variable | Default | Purpose |
| --- | --- | --- |
| `ENGINE_STATE_DIR` | `/var/lib/vacti-engine` | Where the enrolled identity is persisted. This is the path to mount your volume at. |
| `VACTI_AUTO_UPDATE` | `0` | Off by default. See the updates guide for the recommended update path. |

### ENGINE_STATE_DIR

This is the path your persistence volume mounts to. Mount a named volume here so
the enrolled identity survives a restart. See the persistence guide for details.

### VACTI_AUTO_UPDATE

Off by default. For containers the recommended update path is to pull a newer
image tag and recreate the container rather than updating in place. See the
updates guide.

## 4. A fuller run example

```bash
docker run -d \
  --name vacti-engine \
  --restart unless-stopped \
  -e VACTI_URL="https://cp.example.internal" \
  -e VACTI_ENROLL_TOKEN="<single-use-enroll-token>" \
  -e ENGINE_ID="vacti-engine-prod-1" \
  -v vacti-engine-state:/var/lib/vacti-engine \
  ghcr.io/anggipradana/vacti-distro:latest
```

Do not guess variable names. If a variable is not in the tables above, it is not
read by the container entrypoint or set in the image, and setting it has no
documented effect here.
