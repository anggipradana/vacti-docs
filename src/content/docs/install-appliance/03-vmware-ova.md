---
title: Import on VMware
description: Import and boot the VACTI OS appliance OVA on VMware Workstation, Player, Fusion, or ESXi.
sidebar:
  order: 3
---

This page covers importing the VACTI appliance into VMware Workstation, Player,
Fusion, or ESXi / vCenter. Use the `*.vmware.ova` file, which carries a
VMware-flavoured OVF descriptor (`vmx-13`) with a streamOptimized VMDK. The
VirtualBox OVA uses `virtualbox-2.2`, which VMware and ovftool reject, so always
pick the matching file.

## Requirements

- VMware Workstation, Player, Fusion, or ESXi / vCenter that accepts a `vmx-13`
  OVF.
- On Apple Silicon, use VMware Fusion 13 and the arm64 OVA; arm64 is UEFI-only.
- The appliance's OVF descriptor defaults to 2 vCPU and 8192 MB (8 GB) RAM on a
  20 GB disk. Give it at least that; raise it for larger engagements.

## 1. Download the OVA

Download the VMware OVA for your architecture from the Hugging Face dataset (see
[Overview](/install-appliance/01-overview/) for the exact URL pattern). You want
the file named `vacti-distro-<version>-<arch>-gui.vmware.ova`.

Verify the checksum before importing:

```sh
sha256sum -c SHA256SUMS
```

## Option A: Workstation, Player, or Fusion (desktop)

### 2. Open the appliance

1. Open VMware Workstation, Player, or Fusion.
2. Click **File**, then **Open** (Workstation / Fusion) or **Open a Virtual
   Machine** (Player).
3. Browse to the `*.vmware.ova` you downloaded and select it.

### 3. Name and import

1. Give the VM a name and a storage location.
2. Click **Import**.
3. If the client warns that the OVF did not pass strict conformance, click
   **Retry** to import in a relaxed mode. The appliance OVF is valid for VMware;
   this prompt is normal for a hand-authored descriptor.
4. Wait for the import to complete.

### 4. Set the network

1. Open the VM's **Settings**, then **Network Adapter**.
2. Choose **Bridged** so the appliance gets its own LAN address and can reach an
   internal control plane and on-network targets. Use **NAT** if you only need
   outbound internet to a cloud control plane.
3. Save the settings.

### 5. (Optional) Prepare non-interactive enrollment

1. Build a `cidata.iso` carrying a filled `user-data` with a fresh single-use
   enrollment token (see
   [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/)).
2. In **Settings**, add a CD/DVD drive and attach the `cidata.iso`.
3. Save the settings.

### 6. Power on

1. Click **Power on this virtual machine**.
2. The appliance runs first-boot enrollment. With a seed ISO attached it enrolls
   and starts the engine automatically; otherwise follow the console steps in
   [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/).

You are NOT asked for an operating-system password; none is baked into the image.
Enrollment needs only the control-plane URL and the enrollment token.

## Option B: ESXi / vCenter (ovftool)

For an unattended vSphere deploy, `ovftool` is the reliable path and lets you set
the enrollment token as an OVF property at deploy time.

### 2. Deploy with ovftool

1. Fill a `user-data` file with a fresh single-use enrollment token.
2. Deploy, passing the token through the VMware guestinfo channel:

```sh
ovftool \
  --prop:guestinfo.userdata="$(base64 -w0 user-data)" \
  --prop:guestinfo.userdata.encoding=base64 \
  vacti-distro-<version>-<arch>-<flavor>.vmware.ova \
  "vi://user@vcenter/.../host"
```

This layers on the same first-boot enrollment unit as every other form; the
token is supplied per instance at deploy time and is never baked into the OVA.

### 3. Power on and verify

1. Power on the VM from the vSphere client or with `govc`.
2. The appliance reads the token from guestinfo, enrolls, and starts the engine.

You can also set the token on an already-registered VM before power-on:

```sh
govc vm.change -vm vacti-engine \
  -e guestinfo.userdata="$(base64 -w0 user-data)" \
  -e guestinfo.userdata.encoding=base64
```

## 7. Reach the engine

Once enrollment completes, the vacti-engine starts. Reach it at the URL your
control plane shows for this engine. The appliance build does not pin a listen
port in the image, so use that control-plane URL rather than guessing a port.

## Troubleshooting

- **Import rejected / VirtualSystemType error.** You are importing the
  VirtualBox OVA. Download the `*.vmware.ova` file instead.
- **OVF conformance warning on import.** Click **Retry** to import in relaxed
  mode; the appliance OVF is valid for VMware.
- **No network / cannot reach the control plane.** Re-check the network adapter
  mode. Bridged needs a live uplink; NAT needs working outbound DNS and
  internet.
- **Enrollment did not complete.** The token is short-lived and single-use.
  Re-mint one in the control plane and retry. See
  [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/).
- **guestinfo token ignored.** Confirm both `guestinfo.userdata` and
  `guestinfo.userdata.encoding` are set, and that the encoding matches the actual
  encoding (`base64` or `gzip+base64`).

## Next steps

- [First boot and enrollment](/install-appliance/05-first-boot-enrollment/)
