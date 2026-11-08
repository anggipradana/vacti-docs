---
title: Choosing how to install
description: A decision guide for picking the right Vacti engine image form, plus where the web control plane fits.
sidebar:
  order: 2
---

Vacti publishes the engine in two image forms. They both run the same engine
and boot into the same enrollment flow, so the only question is which one matches
the infrastructure you already run. This page is a decision guide.

The web control plane is **not** one of these image forms. It is a separate
deployment you run once; see [The control plane is separate](#the-control-plane-is-separate)
at the end.

## Quick decision

- You run **VMware or VirtualBox** -> use the **OVA**.
- You run a **container stack**, or just want a quick throwaway session -> use the
  **Docker image**.
- You need the **web app that operators use** -> that is the control plane, a
  separate deploy.

## At a glance

| Form | Best for | Host | Notes |
| --- | --- | --- | --- |
| OVA | VMware, VirtualBox | VMware Workstation/ESXi/Fusion, VirtualBox | Import the appliance and power on. |
| Docker | Container stacks, quick runs | Any Docker host (amd64 or arm64) | `docker run` session, no VM to manage. |
| Web (control plane) | Operators | Docker Compose on a server | Separate deploy, not an engine image. |

## OVA, for VMware and VirtualBox

The OVA is the appliance packaged for the two most common desktop and server VM
hosts. Import it into VMware (Workstation, ESXi, or Fusion) or VirtualBox, give it
a network, and power it on. On first boot it runs the enrollment flow.

OVA images are published for both amd64 and, on arm64, for the Apple Silicon VM
hosts (VirtualBox 7.1 or later, VMware Fusion 13). Pick the architecture that
matches your host.

Choose the OVA when you already manage VMware or VirtualBox and want a
drop-in appliance.

## Docker, for container stacks

The Docker image is a universal multi-arch image (amd64 and arm64) published to
the GitHub Container Registry (GHCR) as `ghcr.io/anggipradana/vacti-distro`. It is
meant for "docker run" pentest sessions where you do not want a full VM at all. It
is the fastest way to get an engine for a short-lived test, and it fits naturally
into a container-based lab.

The enrollment token is supplied per run at `docker run` time rather than baked
into the image, so no secret lives in the image itself. Registry access is
operator-controlled: authenticate to GHCR with a GitHub token that can read the
package before you pull. See the [Docker install docs](/install-docker/01-pull-and-run/)
for the full pull-and-run flow.

Choose Docker when you run containers, want quick disposable engines, or are
scripting engine creation.

## The control plane is separate

Every form above is the **engine**: the component that does the testing. The
**web control plane** is the application your operators log in to, and it is a
separate deployment with its own lifecycle.

The control plane runs as a small self-hosted stack. You deploy it once, on a
server you control, and point your engines at it during enrollment. It is not
shipped as an engine appliance image, because it is not an appliance you clone per
engagement; it is the single source of truth all engines report to.

So the complete picture is: deploy the control plane once, then bring up as many
engines as you need from whichever image form fits your infrastructure, and
enroll each one against that control plane.

## Where to go next

- Install an appliance: [appliance install docs](/install-appliance/01-overview/).
- Install via Docker: [Docker install docs](/install-docker/01-pull-and-run/).
- Understand enrollment first: [First-boot enrollment](/install-appliance/05-first-boot-enrollment/).
