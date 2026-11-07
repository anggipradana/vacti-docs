---
title: How your engine stays protected
description: Why a downloaded Vacti image is inert until you activate it, and how the license boundary and the locked-down appliance keep your methodology safe.
sidebar:
  order: 2
---

A Vacti image is only useful once it is bound to your control plane. This page
explains, from an operator's point of view, why a freshly downloaded image can
do nothing on its own, and what keeps the engine safe once it is running.

You do not need any of this to run Vacti. It is here so you understand why
enrollment has to succeed before a box can do anything, and why a copied image
is harmless.

## A downloaded image is inert

Every image you download (the OVA, the qcow2, the installable ISO, and the
Docker image) is ready to run but switched off. It carries no license, no
enrollment token, and no reusable secret. Until you activate it against your
control plane, it is inert: it will not test anything, and it cannot be used as
a working engine.

That is the point. The valuable part of Vacti is the methodology, and the thing
that unlocks it is your control plane, not the file you downloaded.

## Activation is the boundary

A box becomes a working engine only after it activates against your control
plane, and only if your license token is valid and has not already been used.
The sequence is simple:

1. You boot the image and give it two things: your control-plane URL and a
   single-use license token.
2. The box contacts your control plane and proves it holds a valid token.
3. It finishes enrollment and the engine comes online.

This happens on first boot and is usually near-instant. From then on the box is
a working engine. If the token is missing, expired, or already used, the box
stays inert; you re-mint a token and try again.

Because activation is the boundary, only an appliance holding a valid, unused
token can ever become a live engine. A token that is revoked or never issued
yields nothing.

## The box runs as a locked-down appliance

Once activated, the box behaves as a sealed appliance, not a general-purpose
computer. After enrollment a Vacti appliance presents an operator console for
day-to-day tasks such as networking, rather than an open desktop you can roam.
This keeps the methodology on the box out of easy reach: an operator can run
engagements without being handed a way to copy the engine off the appliance.
Hands-on maintenance is available through a separate, request-only
administrator path (see [Troubleshooting](/architecture/04-troubleshooting/)).

## Why it is built this way

Two reasons, and they reinforce each other:

- **Your license is the switch.** Because a box is useless until it activates
  against a live, licensed control plane, a revoked or missing license means no
  working engine. This is the same boundary described in the
  [architecture overview](/architecture/01-overview/).
- **A leaked image leaks nothing usable.** No image carries a license or any
  reusable secret, and the appliance exposes no easy way to extract what is
  inside it. A copied or un-enrolled image cannot run on its own.

## What this means for operators

- **A fresh image is switched off until you activate it.** Expect first boot to
  move straight to activation; there is no long download step once the box has
  network and a valid token.
- **Activation needs network and a valid token.** The box has to reach your
  control plane, so first boot needs outbound network access and a token that
  has not expired or been used. Mint the token close to boot time.
- **The same rule applies to Docker.** A container is inert until you give it
  your control-plane URL and a token at run time. See
  [Pull and Run](/install-docker/01-pull-and-run/).
- **Copied images are harmless.** Because no image carries a license or secret,
  a copied or leaked image cannot run on its own. Nothing valuable leaves with
  the file.
- **If activation fails, it is usually network or token.** A first boot that
  cannot reach the control plane, or that presents an expired or used token,
  will not come online. Fix connectivity or re-mint a token and retry. See
  [Troubleshooting](/architecture/04-troubleshooting/).

## Where to go next

- The big picture: [Architecture overview](/architecture/01-overview/).
- Get a box online: [First-boot enrollment](/install-appliance/05-first-boot-enrollment/).
- Run it as a container: [Pull and Run](/install-docker/01-pull-and-run/).
