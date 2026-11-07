---
title: Create boot media
description: Download and verify a Vacti OS ISO, write it to a USB stick or DVD, and boot it under UEFI or legacy BIOS.
sidebar:
  order: 2
---

This page covers downloading the right ISO, verifying it, writing it to boot
media, and booting the target machine into the installer. The ISO is a hybrid,
dd-able image, so writing it is a single copy to a raw device.

## 1. Download the ISO

Pick the file that matches your architecture and SKU (see
[the overview](/install-iso/01-overview/) for the four deliverables), then
download it from the Hugging Face dataset.

```
# Example: amd64 GUI, v0.1.0. Replace the version, arch, and sku to match.
VERSION=0.1.0
ARCH=amd64        # amd64 | arm64
SKU=gui           # gui | headless
BASE=https://huggingface.co/datasets/anggipradana/vacti-distro-images/resolve/main

curl -fL -o "vacti-distro-${VERSION}-${ARCH}-${SKU}.iso" \
  "${BASE}/v${VERSION}/vacti-distro-${VERSION}-${ARCH}-${SKU}.iso"
```

Download the checksum file for the same release too:

```
curl -fL -o SHA256SUMS "${BASE}/v${VERSION}/SHA256SUMS"
```

## 2. Verify the download

Each release directory on the dataset carries a `SHA256SUMS` file covering every
file in that release. Verify your ISO against it before writing:

```
sha256sum -c SHA256SUMS --ignore-missing
```

You want an `OK` line for the ISO you downloaded. If the check fails, the
download is incomplete or corrupt. Delete it and download again. Do not write an
ISO that does not verify.

## 3. Identify the target device

Writing an image overwrites the whole target device, so identify it exactly and
double-check before you write. Picking the wrong device destroys its data.

**Linux:**

```
lsblk -o NAME,SIZE,MODEL,TRAN
```

Find your USB stick by size and model. It will be something like `/dev/sdb` or
`/dev/mmcblk0`. Use the whole-disk node, not a partition (`/dev/sdb`, not
`/dev/sdb1`).

**macOS:**

```
diskutil list
```

Find the external disk (for example `/dev/disk4`), then unmount it before
writing:

```
diskutil unmountDisk /dev/disk4
```

## 4. Write the ISO to USB

The hybrid ISO is written raw to the device.

**Linux:**

```
sudo dd if=vacti-distro-0.1.0-amd64-gui.iso of=/dev/sdX bs=4M status=progress oflag=sync
sync
```

Replace `/dev/sdX` with the device you identified in step 3. Wait for `dd` to
finish and for `sync` to return before removing the stick.

**macOS** (use the raw node `rdisk` for speed):

```
sudo dd if=vacti-distro-0.1.0-amd64-gui.iso of=/dev/rdiskN bs=4m
```

**Cross-platform GUI tool:** [balenaEtcher](https://etcher.balena.io/) writes the
same image on Windows, macOS, and Linux. Select the ISO, select the USB device,
and flash. Do not let the OS "format" or "repair" the stick afterward; the raw
layout is intentional.

## 5. Burn to DVD (optional)

The amd64 ISO also boots from optical media. Burn it as a disc image (not as a
data disc) with your platform's disc utility, for example `growisofs`, Brasero,
K3b, or the built-in burner on macOS and Windows. arm64 machines generally have
no optical drive, so USB is the practical path there.

## 6. Boot from a VM instead of physical media

If you are installing into a virtual machine, you do not need a USB stick:
attach the ISO file directly as a virtual optical drive and set the VM to boot
from it.

- Use a **UEFI** (EFI) firmware type for the VM. For arm64 guests this is
  required; the arm64 ISO is UEFI only.
- Give the VM enough disk for a full install plus working space.
- Leave networking attached so first-boot enrollment can reach the control
  plane.

## 7. Boot the target machine

1. Insert the USB stick (or attach the ISO) and power on the machine.
2. Open the firmware boot menu. The key varies by vendor: common ones are
   `F12`, `F11`, `F9`, `Esc`, or `Del` during the power-on screen.
3. Select the USB stick or the virtual DVD. On a UEFI machine, prefer the entry
   prefixed `UEFI:` when one is shown.
4. The boot loader menu appears. On amd64 this is isolinux under legacy BIOS or
   GRUB under UEFI; on arm64 it is GRUB-EFI. There is a short auto-boot
   countdown, after which the default entry starts on its own, so you can leave
   it or press `Enter` to boot immediately.

## UEFI and Secure Boot

The ISO boots under UEFI through GRUB-EFI (and, on amd64, under legacy BIOS
through isolinux). The build does not include the signed shim chain, so the
images are **not Secure Boot signed**. If the machine has Secure Boot enabled and
refuses to boot the USB stick (often a "Security Boot Fail" or an
image-verification error), disable Secure Boot in the firmware setup, then boot
again:

1. Enter firmware setup (commonly `Del`, `F2`, or `F10` at power-on).
2. Find the Secure Boot setting (often under a Security or Boot tab) and set it
   to Disabled.
3. Save and exit, then reopen the boot menu and select the USB stick.

If the machine still will not see the stick, confirm the firmware boot mode
matches the media: the amd64 ISO works in both UEFI and legacy/CSM modes, while
arm64 is UEFI only.

## Next step

[Step through the installer](/install-iso/03-installer-walkthrough/).
