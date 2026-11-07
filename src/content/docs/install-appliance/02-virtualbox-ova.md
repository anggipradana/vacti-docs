---
title: Import on VirtualBox
description: Import and boot the VACTI OS appliance OVA in Oracle VirtualBox.
sidebar:
  order: 2
---

This page covers importing the VACTI appliance into Oracle VirtualBox on a
desktop or workstation. Use the `*.vbox.ova` file, which carries a
VirtualBox-flavoured OVF descriptor (`VirtualSystemType=virtualbox-2.2`). The
VMware OVA will NOT import cleanly in VirtualBox; use the matching file.

## Requirements

- VirtualBox 7.1 or newer. On Apple Silicon or another arm64 host, use
  VirtualBox 7.1+ and the arm64 OVA; arm64 is UEFI-only.
- Enough free disk for the imported disk (20 GB virtual, thin-provisioned).
- The appliance defaults, from its OVF descriptor, are 2 vCPU and 8192 MB (8 GB)
  RAM. Give it at least that; raise it for larger engagements.

## 1. Download the OVA

Download the VirtualBox OVA for your architecture and flavor from the Hugging
Face dataset (see [Overview](/install-appliance/01-overview/) for the exact URL
pattern and the [flavor](/install-appliance/01-overview/#flavors-headless-and-gui)
choice). You want the file named `vacti-distro-<version>-<arch>-<flavor>.vbox.ova`
— for a click-through first-run wizard pick the `-gui` file; for console/SSH
enrollment pick the `-headless` file.

Verify the checksum before importing:

```sh
sha256sum -c SHA256SUMS
```

## 2. Open the import dialog

1. Open VirtualBox.
2. Click **File**, then **Import Appliance...**.
3. In the **File** field, browse to the `*.vbox.ova` you downloaded.
4. Click **Next**.

## 3. Review the appliance settings

VirtualBox shows the settings read from the OVF descriptor.

1. Confirm the guest type is Debian (64-bit for amd64, or the arm64 variant).
2. Confirm CPU is 2 and RAM is 8192 MB, or raise them now for a heavier
   workload.
3. Leave **MAC Address Policy** at "Generate new MAC addresses for all network
   adapters" so a cloned appliance does not collide on the network.
4. Decide on the disk import path if you want it somewhere other than the
   default VM folder.
5. Click **Finish** and wait for the import to complete.

## 4. Set the network mode

The appliance must be able to reach your control plane to enroll.

1. Select the imported VM.
2. Click **Settings**, then **Network**.
3. For most setups, set **Adapter 1** to **Bridged Adapter** and choose your
   physical NIC. Bridged puts the appliance on your LAN with its own address,
   which is the simplest path for reaching an internal control plane and for
   reaching targets on the same network.
4. If you only need the appliance to reach the internet (for a cloud control
   plane) and not be reachable inbound, **NAT** also works.
5. Click **OK**.

## 5. (Optional) Prepare non-interactive enrollment

The appliance enrolls on first boot (the headless flavor from the console or a seed; the GUI flavor via its on-screen wizard). The simplest way to hand it
the control-plane URL and enrollment token without a console is to attach a
NoCloud seed CD. This is optional; you can also enroll from the console.

1. Build a `cidata.iso` that carries a filled `user-data` with a fresh
   single-use enrollment token (see
   [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/)).
2. In **Settings**, then **Storage**, add an optical drive and attach the
   `cidata.iso`.
3. Click **OK**.

## 6. Start the appliance

1. Select the VM.
2. Click **Start** (normal start shows the console window).
3. Watch the boot. The appliance runs its first-boot enrollment:
   - If you attached a seed ISO, it reads the token, enrolls against your
     control plane, and starts the engine automatically.
   - If you did not, follow the console enrollment steps in
     [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/).

You are NOT prompted for an operating-system password. No OS password is baked
into the image. The only inputs enrollment needs are the control-plane URL and
the enrollment token.

## 7. Reach the engine

Once enrollment completes, the vacti-engine starts. Reach it at the URL your
control plane shows for this engine. The appliance build does not pin a listen
port in the image, so use that control-plane URL rather than guessing a port.

To find the VM's address, log in at the console only if you have set a user
password out of band, or read the address from your DHCP server or control-plane
engine list.

## Troubleshooting

- **Import fails with a VirtualSystemType error.** You are importing the VMware
  OVA. Download the `*.vbox.ova` file instead.
- **No network / cannot reach the control plane.** Re-check step 4. A bridged
  adapter must point at a live physical NIC; a NAT adapter needs working
  outbound DNS and internet.
- **Enrollment did not complete.** The token may be expired or already used.
  Enrollment tokens are short-lived and single-use. Re-mint one in the control
  plane and retry. See
  [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/).
- **arm64 OVA will not import.** Confirm you are on an arm64 host with
  VirtualBox 7.1+. An arm64 image cannot run on an amd64 host without full
  emulation.

## Next steps

- [First boot and enrollment](/install-appliance/05-first-boot-enrollment/)
