---
title: Choosing how to install
description: A decision guide for picking the right Vacti engine image form, plus where the web control plane fits.
sidebar:
  order: 2
---

Vacti publishes the engine as several image forms. They all run the same engine
and boot into the same enrollment flow, so the only question is which one matches
the infrastructure you already run. This page is a decision guide.

The web control plane is **not** one of these image forms. It is a separate
deployment you run once; see [The control plane is separate](#the-control-plane-is-separate)
at the end.

## Quick decision

- You run **VMware or VirtualBox** -> use the **OVA**.
- You run **KVM or Proxmox** -> use the **qcow2**.
- You run a **container stack**, or just want a quick throwaway session -> use the
  **Docker image**.
- You are installing on **bare-metal hardware** -> use the **ISO**.
- You need the **web app that operators use** -> that is the control plane, a
  separate deploy.

## Comparison

| Form | Best for | Hypervisor / host | Notes |
| --- | --- | --- | --- |
| OVA | VMware, VirtualBox | VMware Workstation/ESXi/Fusion, VirtualBox | Import the appliance and power on. |
| qcow2 | KVM, Proxmox | libvirt/QEMU, Proxmox VE | Attach the disk to a new VM. |
| Docker | Container stacks, quick runs | Any Docker host (amd64 or arm64) | `docker run` session, no VM or ISO. |
| ISO | Bare metal | Physical hardware | Headless SKU or GUI SKU. |
| Web (control plane) | Operators | Docker Compose on a server | Separate deploy, not an engine image. |

## OVA, for VMware and VirtualBox

The OVA is the appliance packaged for the two most common desktop and server
hypervisors. Import it into VMware (Workstation, ESXi, or Fusion) or VirtualBox,
give it a network, and power it on. On first boot it runs the enrollment flow.

OVA images are published for both amd64 and, on arm64, for the Apple Silicon
hypervisors (VirtualBox 7.1 or later, VMware Fusion 13). Pick the architecture
that matches your host.

Choose the OVA when you already manage VMware or VirtualBox and want a
drop-in appliance.

## qcow2, for KVM and Proxmox

The qcow2 is the raw appliance disk in the native QEMU format. Attach it to a new
VM under libvirt/QEMU or import it into Proxmox VE. This is the leanest VM form
because there is no OVF envelope to unpack; you point a VM at the disk and boot.

Choose the qcow2 when your virtualization is KVM-based (libvirt or Proxmox).

## Docker, for container stacks

The Docker image is a universal multi-arch image (amd64 and arm64) published to
the GitHub Container Registry (GHCR) as `ghcr.io/anggipradana/vacti-distro`. It is
meant for "docker run" pentest sessions where you do not want a full VM or ISO at
all. It is the fastest way to get an engine for a short-lived test, and it fits
naturally into a container-based lab.

The enrollment token is supplied per run at `docker run` time rather than baked
into the image, so no secret lives in the image itself. Registry access is
operator-controlled: authenticate to GHCR with a GitHub token that can read the
package before you pull. See the [Docker install docs](/install-docker/01-pull-and-run/)
for the full pull-and-run flow.

Choose Docker when you run containers, want quick disposable engines, or are
scripting engine creation.

## ISO, for bare metal

The ISO is an installable image for physical hardware. It ships in two SKUs:

- **headless** - no desktop, for servers and rack hardware you manage over SSH or
  a console.
- **GUI** - includes a desktop and a graphical first-boot activation kiosk, for a
  workstation-style install.

On the GUI SKU, the desktop login is withheld until the box is enrolled: a
pre-login activation kiosk walks you through networking and entering your
enrollment token before the desktop is offered. See
[First-boot enrollment](/install-appliance/05-first-boot-enrollment/) for the
walkthrough.

Choose the ISO when you are provisioning real hardware rather than a VM.

## The control plane is separate

Every form above is the **engine**: the component that does the testing. The
**web control plane** is the application your operators log in to, and it is a
separate deployment with its own lifecycle.

The control plane runs as a small self-hosted stack. You deploy it once, on a
server you control, and point your engines at it during enrollment. It is not
shipped as an OVA,
qcow2, or ISO, because it is not an appliance you clone per engagement; it is the
single source of truth all engines report to.

So the complete picture is: deploy the control plane once, then bring up as many
engines as you need from whichever image form fits your infrastructure, and
enroll each one against that control plane.

## Where to go next

- Install an appliance: [appliance install docs](/install-appliance/01-overview/).
- Install via Docker: [Docker install docs](/install-docker/01-pull-and-run/).
- Install from ISO: [ISO install docs](/install-iso/01-overview/).
- Understand enrollment first: [First-boot enrollment](/install-appliance/05-first-boot-enrollment/).
