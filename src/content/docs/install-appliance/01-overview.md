---
title: Appliance Overview
description: Image forms, architectures, sizes, and where to download the VACTI OS appliance images.
sidebar:
  order: 1
---

The VACTI OS appliance is a pre-built Debian 13 "trixie" disk image with the
vacti-engine already installed. You boot it in a hypervisor, enroll it against
your control plane with a short-lived token, and it starts the engine. There is
nothing to compile and no package to install by hand.

Both appliance forms are a repackaging of the SAME base image, so the VirtualBox
OVA and the VMware OVA are the same engine, arsenal, and enrollment chain. They
differ only in the OVF descriptor the hypervisor expects.

## What you get

The appliance is based on Debian 13 ("trixie"). The image carries the
engine, its baked tool arsenal (the full web, infrastructure, and mobile tooling
by default), the reverse-engineering stack, and the first-boot enrollment
mechanism. It carries NO secret: no enrollment token, no engine token, no VPN
key. The license arrives per boot at enrollment time (see
[First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/)).

The appliance boots into a graphical first-run wizard that walks you through
networking and enrollment on screen, then into the appliance operator console
once the box is enrolled. You never type an OS password to bring the appliance
up; the only thing first boot asks for is the control-plane URL and your
enrollment token (the license). For hands-on maintenance the appliance ships with
a non-public local administrator account in the `sudo` group; request its
credentials from your Vacti licensing contact. Root login stays disabled.

## Image forms

The appliance ships as two OVA forms. Pick the one that matches your hypervisor.

| Form | File | Hypervisor / target |
| --- | --- | --- |
| VirtualBox OVA | `*-gui.vbox.ova` | VirtualBox 7.1+ desktop |
| VMware OVA | `*-gui.vmware.ova` | Workstation / Player / Fusion / ESXi |

The two OVAs are NOT interchangeable. VirtualBox stamps
`VirtualSystemType=virtualbox-2.2` in its OVF descriptor, which VMware and
ovftool reject. VMware wants `vmx-13`. Both OVAs wrap the same disk image with a
different descriptor, which is why there are two files. Download the one that
matches your hypervisor:

- VirtualBox: use the `*.vbox.ova` file.
- VMware: use the `*.vmware.ova` file.

## Architectures

Images are published for two architectures, each as both OVAs:

- **amd64** (x86_64): the primary target. Ships the VirtualBox OVA and the VMware
  OVA.
- **arm64** (aarch64): ships the VirtualBox OVA and the VMware OVA. arm64 is
  UEFI-only (no BIOS boot). Import an arm64 OVA on an arm64-host hypervisor, for
  example VirtualBox 7.1+ or VMware Fusion 13 on Apple Silicon.

Pick the architecture that matches your host CPU. Running an amd64 image on an
arm64 host (or the reverse) requires full CPU emulation and is not supported for
the appliance.

## Approximate sizes

- The appliance disk has a 20 GB virtual size. The compressed download is far
  smaller because free space is discarded before packaging.
- The OVA downloads are multiple gigabytes each.

For how much RAM, disk, and vCPU to give the running VM, the appliance's own OVF
descriptors default to **2 vCPU** and **8192 MB (8 GB) RAM** on a **20 GB** disk,
which is the documented starting point; raise it for larger engagements.

## Where to download

The images are published to a public Hugging Face Dataset, which allows large
files with stable public resolve URLs.

Dataset: **`anggipradana/vacti-distro-images`**

Each release is published under a `v<version>/` directory. The public resolve
URL pattern is:

```
https://huggingface.co/datasets/anggipradana/vacti-distro-images/resolve/main/v<version>/<filename>
```

For example, the amd64 VirtualBox OVA for release 0.1.12:

```
https://huggingface.co/datasets/anggipradana/vacti-distro-images/resolve/main/v0.1.12/vacti-distro-0.1.12-amd64-gui.vbox.ova
```

and the amd64 VMware OVA for the same release:

```
https://huggingface.co/datasets/anggipradana/vacti-distro-images/resolve/main/v0.1.12/vacti-distro-0.1.12-amd64-gui.vmware.ova
```

Filenames follow the scheme `vacti-distro-<version>-<arch>-gui.<form>`:

| Form | Filename pattern |
| --- | --- |
| VirtualBox OVA | `vacti-distro-<version>-<arch>-gui.vbox.ova` |
| VMware OVA | `vacti-distro-<version>-<arch>-gui.vmware.ova` |

Here `<arch>` is `amd64` or `arm64`.

The subsequent pages in this section just say "download the OVA for your arch";
use the pattern above to build the exact URL for the release and architecture you
want. The dataset README page also lists the latest release with ready-made
download links.

## Verify your download

Each release directory contains a `SHA256SUMS` file. Download it alongside the
image, then verify in the directory holding the image:

```sh
curl -fL -O "https://huggingface.co/datasets/anggipradana/vacti-distro-images/resolve/main/v<version>/SHA256SUMS"
sha256sum -c SHA256SUMS
```

A mismatch means a corrupted or incomplete download; re-fetch before importing.

## Fallback if Hugging Face is unreachable

If you cannot reach Hugging Face from your network:

1. Download the image from a host that can reach it, verify the SHA256, then
   copy it in over your own transport (USB, internal mirror, scp).
2. Ask your VACTI contact for an internal mirror URL; the resolve path and
   filenames are identical under any mirror of the dataset.
3. If you only need a running engine and not the full appliance, the universal
   Docker image and the .deb on the apt repo are alternative delivery paths;
   see the engine distribution notes.

## Next steps

- [Import on VirtualBox](/install-appliance/02-virtualbox-ova/)
- [Import on VMware](/install-appliance/03-vmware-ova/)
- [First boot and enrollment](/install-appliance/05-first-boot-enrollment/)
