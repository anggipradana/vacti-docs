---
title: Run on KVM / Proxmox
description: Boot the VACTI OS appliance qcow2 image on KVM, libvirt, or Proxmox VE.
sidebar:
  order: 4
---

This page covers running the VACTI appliance from the cloud `qcow2` image on
KVM, libvirt / virt-manager, or Proxmox VE. The qcow2 is the same appliance disk
as the OVAs, in the native format KVM-based hypervisors expect. There is no OVF to
import; you attach the disk directly.

## Requirements

- A KVM host with libvirt, virt-manager, or Proxmox VE.
- UEFI firmware (OVMF) available on the host. The arm64 image is UEFI-only; the
  amd64 image boots fine under UEFI as well.
- Recommended starting point, matching the appliance's own defaults: 2 vCPU,
  8192 MB (8 GB) RAM, 20 GB disk. Raise RAM and vCPU for larger engagements.

Note on architecture: the `qcow2` and `raw.gz` cloud forms are published for
amd64. For an arm64 KVM host, use the arm64 OVA's disk, or request a qcow2 build.

## 1. Download the qcow2

Download the qcow2 for your architecture and flavor from the Hugging Face
dataset (see [Overview](/install-appliance/01-overview/) for the exact URL
pattern and the [flavor](/install-appliance/01-overview/#flavors-headless-and-gui)
choice). You want the file named `vacti-distro-<version>-<arch>-<flavor>.qcow2`.
For a KVM/Proxmox server the `-headless` flavor (console/SSH enrollment) is the
usual pick; the `-gui` flavor adds a graphical first-run wizard and desktop.

Verify the checksum, then place it where your hypervisor keeps disks, for
example `/var/lib/libvirt/images/`:

```sh
sha256sum -c SHA256SUMS
sudo cp vacti-distro-<version>-amd64-headless.qcow2 /var/lib/libvirt/images/
```

If a provider wants a raw disk instead of qcow2, download the `*.raw.gz` form
and `gunzip` it.

## 2. Prepare the enrollment seed (recommended)

The appliance enrolls on first boot (the headless flavor from the console or a seed; the GUI flavor via its on-screen wizard). The portable way to hand it
the control-plane URL and token on a KVM host is a NoCloud seed CD.

1. Fill a `user-data` (and `meta-data`) file with a fresh single-use enrollment
   token (see [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/)).
2. Build the seed ISO:

```sh
genisoimage -output cidata.iso -volid cidata -joliet -rock user-data meta-data
```

You will attach `cidata.iso` as a second CD-ROM in the next step.

## Option A: libvirt / virt-install

### 3. Define and boot the VM

```sh
virt-install \
  --name vacti-appliance \
  --memory 8192 \
  --vcpus 2 \
  --os-variant debian13 \
  --boot uefi \
  --disk path=/var/lib/libvirt/images/vacti-distro-<version>-amd64-headless.qcow2,format=qcow2,bus=virtio \
  --disk path=/path/to/cidata.iso,device=cdrom \
  --network bridge=br0,model=virtio \
  --graphics none \
  --import \
  --noautoconsole
```

Notes:

- `--boot uefi` selects OVMF firmware. Omit the cidata disk line if you plan to
  enroll from the console instead.
- `--network bridge=br0` puts the appliance on your LAN so it can reach an
  internal control plane and on-network targets. Use your actual bridge name.
- `--import` boots the existing disk without running an installer.

### 4. Watch enrollment

```sh
virsh console vacti-appliance
```

With a seed attached the appliance enrolls and starts the engine automatically.
Otherwise follow the console steps in
[First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/). You are not asked for an
operating-system password; none is baked into the image.

## Option B: Proxmox VE

### 3. Create the VM shell

1. In the Proxmox web UI, click **Create VM**.
2. On **General**, give it a name.
3. On **OS**, choose **Do not use any media** (you will attach the qcow2
   directly).
4. On **System**, set **BIOS** to **OVMF (UEFI)** and add an **EFI Disk** on
   your storage. Set **Machine** to `q35`.
5. On **Disks**, remove the default disk (you will import the qcow2 next).
6. On **CPU**, set 2 cores. On **Memory**, set 8192 MB.
7. On **Network**, attach to your bridge (for example `vmbr0`) with the VirtIO
   model.
8. Finish to create the empty VM. Note its VM ID.

### 4. Import the qcow2 disk

From the Proxmox host shell, import the downloaded qcow2 into the VM's storage
(replace `<vmid>` and `local-lvm` with yours):

```sh
qm importdisk <vmid> vacti-distro-<version>-amd64-headless.qcow2 local-lvm
```

Then in the web UI:

1. Open the VM's **Hardware** tab.
2. Double-click the **Unused Disk 0** that appeared and attach it as a VirtIO or
   SCSI disk.
3. In **Options**, set the **Boot Order** so this disk is first.

### 5. Attach the enrollment seed (recommended)

1. Upload `cidata.iso` to a storage that holds ISO images.
2. In **Hardware**, add a **CD/DVD Drive** and select the uploaded
   `cidata.iso`.

### 6. Start and enroll

1. Click **Start**.
2. Open the **Console**.
3. With the seed attached the appliance enrolls and starts the engine
   automatically; otherwise follow the console steps in
   [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/).

## 7. Reach the engine

Once enrollment completes, the vacti-engine starts. Reach it at the URL your
control plane shows for this engine. The appliance build does not pin a listen
port in the image, so use that control-plane URL rather than guessing a port.

## Troubleshooting

- **VM will not boot / black screen.** Confirm UEFI (OVMF) firmware is selected.
  The arm64 image is UEFI-only, and UEFI is the tested path for amd64 too.
- **Disk not found on boot.** Confirm the imported qcow2 is attached and first in
  the boot order (Proxmox), or that the `--disk` path is correct (virt-install).
- **No network / cannot reach the control plane.** Confirm the bridge name and
  that the host bridge has a live uplink.
- **Enrollment did not complete.** The token is short-lived and single-use.
  Re-mint one in the control plane and retry. See
  [First Boot and Enrollment](/install-appliance/05-first-boot-enrollment/).

## Next steps

- [First boot and enrollment](/install-appliance/05-first-boot-enrollment/)
