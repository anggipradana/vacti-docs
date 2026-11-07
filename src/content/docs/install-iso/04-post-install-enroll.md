---
title: Post-install and enrollment
description: First boot after an ISO install, enrolling the box with a control-plane URL and license token, and verifying the engine came up.
sidebar:
  order: 4
---

The installer never bakes an enrollment token or a control-plane URL into the
installed system, so a freshly installed box is inert until you enroll it. On the
first boot after install, the same first-boot enrollment flow the OVA and cloud
forms use runs here too. This page covers what happens on first boot, what you
provide, and how to confirm the engine is up.

## What runs on first boot

The installer enabled a one-time first-boot enrollment unit
(`vacti-firstrun.service`) on the installed system. On first boot it runs the
shared first-boot script, which:

1. Prompts for (or reads) the control-plane URL and a per-boot enrollment token.
2. Enrolls the box with the control plane.
3. Writes the engine configuration (`/etc/vacti-engine/engine.env`).
4. Disables itself so it does not run again.

The unit is guarded so it only runs while `/etc/vacti-engine/engine.env` does not
yet exist. Once the box is enrolled, that file is present and the first-boot unit
stays dormant on later boots. No token is ever baked, and the unit fails loudly
rather than silently if no live token is supplied.

Which interface you use to supply the two values depends on the SKU.

### GUI SKU: the pre-login activation kiosk

On the GUI SKU the box boots into a **pre-login activation kiosk**
(`vacti-activate`) that runs before the LightDM desktop login. The desktop login
is gated off until the box is enrolled. The kiosk has two stages:

- **Stage A, network:** bring the box onto the network (wired, Wi-Fi, 802.1x,
  DNS, with optional proxy, host VPN, or an overlay admin tunnel), then it checks that the
  control-plane URL is reachable.
- **Stage B, enroll:** you enter the control-plane URL and the enrollment token
  (your license). The kiosk hands them to the existing first-boot enroll chain,
  waits for enrollment to complete, then starts the desktop login.

The kiosk fails open: if there is no usable display, it drops to a plain console
login instead of leaving the box stuck. The engine still stays inert without
`engine.env`, so failing open costs nothing on the security side (the control is
server-side).

### Headless SKU: console enrollment

On the headless SKU there is no desktop. The first-boot unit runs on the console
(and serial line, if present) and takes the enrollment token and control-plane
URL there, through the same first-boot script.

## What you provide

Have these ready before first boot:

- **Control-plane URL** - the address of your Vacti control plane.
- **Enrollment token (license)** - minted in the dashboard. The token is
  time-limited and may be single-use, so mint it close to when you will enroll
  and re-mint if it expires before you use it.

The token value is treated as a secret: it is never written to logs, and it is
stored with restrictive permissions while enrollment runs.

## The full enrollment flow

The kiosk stages and the console prompts are the same enrollment chain used by
the pre-baked appliance images. Rather than duplicate it here, follow the
appliance guide for the complete, screen-by-screen flow (networking options,
proxy and VPN, entering the URL and token, and what a successful enroll looks
like):

See [First-boot enrollment](/install-appliance/05-first-boot-enrollment/) in the
appliance guide. The flow is identical once the OS is installed; only how the OS
got onto the disk differs.

## Verify the engine came up

After enrollment completes, `engine.env` exists and the engine service should be
running. Log in with the local administrator account (request credentials from
your Vacti licensing contact) and check:

```
# The enrollment config was written
ls -l /etc/vacti-engine/engine.env

# The engine service is active
systemctl status vacti-engine.service

# First-boot enrollment did its one-time job (should be inactive/dead now)
systemctl status vacti-firstrun.service
```

A healthy box shows `engine.env` present, `vacti-engine.service` active, and the
first-boot unit finished and no longer scheduled to run.

## Troubleshooting

- **Enrollment did not complete.** The token may be expired or already used.
  Re-mint a token in the dashboard and retry. The kiosk retries in place; on the
  console, re-run the flow.
- **Cannot reach the control plane.** Recheck networking in Stage A (the kiosk's
  network step, or your console network setup) and any required proxy or VPN,
  then retry the URL. The kiosk probes reachability before it attempts the
  enroll.
- **Inspect the logs.** The enroll unit logs to the journal:

  ```
  journalctl -u vacti-firstrun.service
  journalctl -u vacti-engine.service
  ```

  The token value itself is not logged, so these are safe to read and share when
  diagnosing.
- **Re-enroll a box.** Because the first-boot unit only runs while `engine.env`
  is absent, enrollment is a one-time step. Re-enrolling is a control-plane and
  engine operation; follow the appliance guide's enrollment page for the
  supported path rather than deleting files by hand.

## Next steps

Your box is installed and enrolled. From here, use the control-plane dashboard to
drive it, and see the rest of this documentation for day-to-day operation.
