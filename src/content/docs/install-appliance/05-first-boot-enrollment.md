---
title: First Boot and Enrollment
description: How the VACTI appliance activates on first boot with a control-plane URL and a single-use token, plus how to request local shell access.
sidebar:
  order: 5
---

The VACTI appliance ships with ZERO credentials. The disk image is ready to run
but switched off: it carries no enrollment token, no engine token, and no VPN
key. The license arrives per boot, at enrollment time, so the same downloadable
image stays inert until you bind it to your control plane.

## Shell login after first boot

Enrollment never asks you for an OS password. For hands-on maintenance after
first boot:

- The appliance ships with a **non-public local administrator account** in the
  `sudo` group. For console or SSH access, request credentials from your Vacti
  licensing contact.
- The root account stays disabled, so the box is administered through that
  account with `sudo`.

You are not asked for an OS password to bring the appliance up. The only inputs
enrollment needs are:

1. The **control-plane URL** (where your VACTI control plane lives).
2. The **enrollment token** (your license). It is short-lived and single-use.

## What happens on first boot

On first boot the appliance brings up networking, then runs its first-boot
enrollment. It takes your token, enrolls against the control plane, and on
success writes `/etc/vacti-engine/engine.env`. The presence of that file is what
tells the rest of the system the box is enrolled, so the engine starts only after
enrollment succeeds.

After you enter the control-plane URL and token, the appliance activates against
your control plane and the engine comes online. This happens once, on first
boot, and is usually near-instant. The image is inert until this activation
succeeds, so the same downloadable file is safe to share until you bind it to
your control plane. See
[How your engine stays protected](/architecture/02-ip-protection/) for why.

If the token is missing, expired, or already used, enrollment fails loudly and
nothing is silently retried with a stale secret. You re-mint a token and try
again.

You can deliver the control-plane URL and token in a few ways: the graphical
activation kiosk shown on first boot, a non-interactive seed, or a console or SSH
session.

## Method 1: Non-interactive seed (hands-free)

This is the portable, hands-free path. You attach a tiny seed that carries a
filled `user-data` with a fresh
single-use token, and the first-boot unit reads it automatically. No console
interaction is required.

1. In your control plane, mint a fresh single-use enrollment token. Tokens are
   short-lived, so mint it close to boot time.
2. Fill a `user-data` template with the token and your control-plane URL.
3. Build a NoCloud seed CD:

   ```sh
   genisoimage -output cidata.iso -volid cidata -joliet -rock user-data meta-data
   ```

4. Attach `cidata.iso` as a CD-ROM to the VM (see the per-hypervisor pages:
   [VirtualBox](/install-appliance/02-virtualbox-ova/), [VMware](/install-appliance/03-vmware-ova/)).
5. Boot. The appliance reads the token, enrolls, writes `engine.env`, and the
   engine comes online.

NoCloud works identically on VMware and VirtualBox, which is why it is the lingua
franca for enrollment.

### VMware guestinfo alternative

On vSphere you can supply the same `user-data` through VMware guestinfo instead
of a CD, as an OVF property at deploy time:

```sh
ovftool \
  --prop:guestinfo.userdata="$(base64 -w0 user-data)" \
  --prop:guestinfo.userdata.encoding=base64 \
  vacti-distro-<version>-<arch>-gui.vmware.ova \
  "vi://user@vcenter/.../host"
```

This layers on the SAME first-boot unit; it is just a different place the token
arrives from. Set both `guestinfo.userdata` and `guestinfo.userdata.encoding`
(either `base64` or `gzip+base64`). Cloud-provider instance metadata is another
optional source that layers on the same unit.

## Method 2: From a console or SSH session

If you prefer a terminal to the graphical kiosk, you can enroll from a console or
SSH session. While
the box is unenrolled, the login banner surfaces the `vacti-netsetup` operator
command, which walks you through setting up networking and then enrollment. The
flow asks only for the control-plane URL and the enrollment token; it never asks
for an OS password.

The enrollment step writes the token and URL to
`/etc/vacti-engine/enroll.token` (mode 0600), then enrolls the box and writes
`engine.env` on success. The token is never logged.

## The graphical activation kiosk

On first boot the appliance presents a small graphical activation kiosk before
any desktop login. It runs as a
systemd unit that owns the console, and the desktop display manager is withheld
until enrollment completes. The kiosk has two steps:

1. **Network.** It opens the network editor so you can set up wired, Wi-Fi,
   802.1x, DNS, VPN, or an optional proxy, so the box can reach the control
   plane.
2. **Enrollment.** It shows a single small form that asks for exactly two things:
   the **control-plane URL** and the **enrollment token (license)**. It asks for
   nothing else. The kiosk has no OS password field; local shell access uses the
   non-public administrator account (request credentials from your Vacti licensing
   contact).

When you submit, the kiosk enrolls the box the same way as every other form, and
on success writes `engine.env` and the box becomes active. If enrollment does not
complete (an expired or single-use token), it tells you to re-mint in the
dashboard and retry.

If you attach a seed (Method 1), the box enrolls hands-free and the kiosk is
skipped entirely; otherwise the kiosk is the interactive path you see on first
boot.

## After enrollment

Once `engine.env` exists, the vacti-engine starts. Reach it at the URL your
control plane shows for this engine. The appliance build does not pin a listen
port in the image, so use that control-plane URL rather than guessing a port.

The enrollment token is single-use and short-lived, so it cannot be replayed from
a copied image. Tokens are revocable at the control plane, which is the real
security boundary: a copied or un-enrolled appliance has no license and cannot
run as an engine until it is activated.

## Troubleshooting enrollment

- **"Could not reach <url>."** Fix networking first (Method 2 console or the GUI
  kiosk network step), then retry. Check DNS, the proxy, and any VPN.
- **"Enrollment did not complete" / token rejected.** The token is expired or was
  already used. Re-mint a fresh single-use token in the control plane and retry.
- **Engine does not start after a seemingly successful boot.** Confirm
  `/etc/vacti-engine/engine.env` exists. If it does not, enrollment did not
  finish; check the first-boot unit's logs with
  `journalctl -u vacti-firstboot`.
- **I want to re-enroll a box.** Remove `/etc/vacti-engine/engine.env` and
  `/etc/vacti-engine/enroll.token`, then boot with a fresh token (via seed or
  console).
