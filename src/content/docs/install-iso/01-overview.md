---
title: ISO install overview
description: Install Vacti OS to bare metal or a VM from the Debian 13 trixie live installer ISO, including the amd64 and arm64 SKUs and where to download them.
sidebar:
  order: 1
---

The Vacti OS ISO is an installable image built on Debian 13 (trixie) with
[live-build](https://wiki.debian.org/DebianLive). Unlike the pre-baked OVA and
qcow2 appliances, the ISO walks an operator through a real install to disk, so
it is the right choice for bare-metal hardware, for a hypervisor that boots from
ISO media, and for any box where you want to control partitioning and the local
account yourself.

This guide covers writing the ISO to boot media, booting it under UEFI (or BIOS
on amd64), stepping through the installer, and completing first-boot enrollment.

## What the ISO gives you

The installed system carries the same Vacti engine contents the OVA and cloud
forms ship: the build materializes the same package list, branding assets, and
first-boot enroll unit from one shared source tree into every form. Choosing the
ISO changes only how the system lands on disk, not what it contains once
installed.

Two things set the ISO apart from the appliance forms:

1. The install is **interactive for the local account password**. No OS password
   is ever baked into the image. The operator sets the password at install time,
   and a weak password is rejected.
2. You pick your own disk, partitioning is guided, and the result is a normal
   Debian install on your own hardware or VM.

After install and reboot, the first-boot enrollment flow still runs. Enrollment
(the control-plane URL plus a license token) is never baked either, so the
installed box stays inert until you enroll it. See
[Post-install and enrollment](/install-iso/04-post-install-enroll/).

## SKUs: GUI and headless

Each architecture ships two ISO SKUs built from the same base:

| SKU | Boot target | What it adds | Use it for |
| --- | --- | --- | --- |
| **GUI** | XFCE desktop with the LightDM login manager | XFCE4, LightDM GTK greeter, NetworkManager front-ends, the Calamares install-to-disk installer, Plymouth splash, and a pre-login activation kiosk | A workstation or an analyst box with a screen and keyboard |
| **headless** | Text console only | No desktop, no display manager. A preseeded debian-installer drives an unattended install (partitioning and locale answered ahead of time; password still prompted) | Rack servers, headless VMs, remote or serial-console installs |

The GUI SKU boots a live XFCE session and you launch the graphical Calamares
installer from it. The headless SKU boots straight into a preseeded
debian-installer. Both installers produce the same installed engine; they differ
only in the install experience. The installer screens and the Vacti-specific
answers are covered in
[Installer walkthrough](/install-iso/03-installer-walkthrough/).

## Architectures

The ISO is built for two architectures, each natively (no cross-build):

- **amd64** (x86-64): a hybrid image that boots on both legacy BIOS (via
  isolinux) and UEFI (via GRUB-EFI).
- **arm64** (aarch64): UEFI only, booting through GRUB-EFI. There is no BIOS or
  isolinux path on arm64; that is a hardware reality, not a limitation of the
  build.

That gives four ISO deliverables per release: amd64 headless, amd64 GUI, arm64
headless, and arm64 GUI.

## Where to download

ISOs are published to the Hugging Face dataset
`anggipradana/vacti-distro-images`. Each release lives under a `v<version>/`
directory, alongside a `SHA256SUMS` file for integrity checking.

The resolve-URL pattern is:

```
https://huggingface.co/datasets/anggipradana/vacti-distro-images/resolve/main/v<version>/<filename>
```

The published ISO filenames follow `vacti-distro-<version>-<arch>-<sku>.iso`:

| Deliverable | Filename (example for v0.1.12) |
| --- | --- |
| amd64 headless | `vacti-distro-0.1.12-amd64-headless.iso` |
| amd64 GUI | `vacti-distro-0.1.12-amd64-gui.iso` |
| arm64 headless | `vacti-distro-0.1.12-arm64-headless.iso` |
| arm64 GUI | `vacti-distro-0.1.12-arm64-gui.iso` |

Replace `0.1.12` with the version you are installing and pick the row that
matches your hardware and SKU.

For current ISO file sizes, check the dataset listing: sizes are not fixed by
the build and the dataset page shows the live figures per file.

## Before you start

Confirm these ahead of time:

- The target machine (or VM) architecture: amd64 or arm64.
- Which SKU you want: GUI for a desktop, headless for a server or remote box.
- A USB stick (or writable DVD, or a VM that boots from an ISO file) to hold the
  image.
- Your enrollment details for after install: the control-plane URL and a valid
  license token. The token is minted in the dashboard and is time-limited, so
  mint it close to when you will enroll.

## Next steps

1. [Create boot media](/install-iso/02-boot-media/) - download, verify, write to
   USB or DVD, and boot under UEFI.
2. [Installer walkthrough](/install-iso/03-installer-walkthrough/) - step through
   the installer and the Vacti-specific answers.
3. [Post-install and enrollment](/install-iso/04-post-install-enroll/) - first
   boot, enroll the box, and verify the engine.
