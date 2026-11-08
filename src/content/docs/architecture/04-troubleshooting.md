---
title: Troubleshooting
description: Common engine and appliance problems - enrollment, the engine service, the login gate, and the browser harness - with what to check and the command to run.
sidebar:
  order: 3
---

This page covers the common ways an appliance can get stuck. Each entry gives the
symptom, the likely cause, and a fix with a command to run. Run the commands as
root on the appliance (over SSH or the console) unless noted.

Before anything else, the single most useful fact: the file
`/etc/vacti-engine/engine.env` is what tells the appliance it is enrolled. Many
problems below reduce to "`engine.env` is missing". Check it first:

```
ls -l /etc/vacti-engine/engine.env
```

## Enrollment fails

**Why**

- The enrollment token is single-use and short-lived. A token that is expired or
  already used is rejected, and first-boot enrollment fails with a clear error.
- The control-plane URL is wrong or unreachable from the engine, so enrollment
  never completes.
- No token was found at all. If the engine finds no token on first boot it stops
  on purpose, because nothing long-lived is baked in.

**Fix**

- Read the first-boot log to see the exact reason:

  ```
  journalctl -u vacti-firstboot -u vacti-firstrun --no-pager
  ```

- If the token was expired or used, mint a fresh token in the control plane and
  retry. Do not reuse the old one.
- Confirm the control-plane URL is reachable from the engine, including any proxy
  or VPN:

  ```
  curl -sS -I https://your-control-plane/
  ```

- If no token was found, place a fresh one at `/etc/vacti-engine/enroll.token`
  (first line the token, optional second line the URL), then start first-boot
  enrollment:

  ```
  systemctl start vacti-firstboot.service   # or vacti-firstrun.service
  ```

## Engine will not start

**Why**

- No `engine.env`. The engine cannot run before enrollment has completed. This is
  really an enrollment problem; see the entry above.
- The control plane is unreachable at boot. The engine reports itself ready only
  after it has successfully reached the control plane, so if the control plane is
  down at boot the service waits rather than failing.
- A persistent crash or a persistently unreachable control plane shows up as the
  service restarting in a loop.

**Fix**

- Check the service state and recent logs:

  ```
  systemctl status vacti-engine.service --no-pager
  journalctl -u vacti-engine.service -n 100 --no-pager
  ```

- Confirm enrollment completed:

  ```
  ls -l /etc/vacti-engine/engine.env
  ```

- If the service is waiting to start, confirm the control-plane URL in
  `engine.env` is reachable from the engine. Once it is reachable the engine
  comes up.

## Engine runs but keeps getting restarted under load

**Why**

- The engine restarts itself to stay healthy rather than letting an
  under-provisioned box thrash. Occasional restarts under a heavy run are the
  self-heal working as designed, not a fault.
- Memory pressure. A genuine runaway is capped and recovered automatically.

**Fix**

- Look for restart or memory lines in the journal:

  ```
  journalctl -u vacti-engine.service --no-pager | grep -iE 'watchdog|oom|memory|restart'
  ```

- Confirm the box meets the engine's memory requirement. If an under-provisioned
  box restarts repeatedly, give it more RAM or swap.

## Login screen never appears (GUI appliance, no desktop login)

**Why**

- On the GUI appliance the desktop login is withheld until the box is enrolled. Until
  then the activation kiosk owns the first console and runs the
  network-then-enroll flow. A box that never finished enrollment shows the kiosk,
  not a desktop login.

**Fix**

- Check whether the enrollment file exists. If it is missing, finish enrollment
  in the kiosk (see [Enrollment fails](#enrollment-fails)):

  ```
  ls -l /etc/vacti-engine/engine.env
  ```

- Read the kiosk log to see where the flow stopped:

  ```
  journalctl -u vacti-activate.service --no-pager
  ```

- If the screen is blank instead of the kiosk, log in on the fallback console,
  complete enrollment from there, then start the desktop:

  ```
  systemctl start lightdm.service
  ```

## Browser harness crashes ("Executable doesn't exist" / CDP not attachable)

**Why**

- The engine uses a pinned browser harness (harnet) for evidence capture. If a
  stray manual browser install fetched a different browser into a cache, the
  pinned harness can be missing and launches fail with "Executable doesn't exist".

**Fix**

- Let the self-heal re-provision the harness. The engine's browser bootstrap runs
  on start and is idempotent, so restarting the engine re-triggers it:

  ```
  systemctl restart vacti-engine.service
  ```

- If the harness still does not come back, reinstall the engine runtime from your
  Vacti distribution channel; that restores the pinned harnet runtime.
- Do not manually install a browser runtime on an engine. The engine resolves its
  own pinned harness; an unpinned install just wastes space and causes confusion.
- A harness-less engine still runs the deterministic probers, so this never blocks
  startup; it only affects browser-based evidence capture.

## Engine shows up as a ghost / gets disabled in the fleet

**Why**

- The control plane tracks each engine by a regular heartbeat the engine sends
  while it holds its long-poll connection. If those heartbeats stop arriving, the
  control plane marks the engine as long-dead and disables it, because it has no
  way to tell a wedged engine from an offline one.
- The usual cause is that the engine can no longer reach the control plane: lost
  outbound network, a firewall or proxy that started blocking outbound HTTPS, or
  the control-plane URL changed.

**Fix**

- Confirm the engine can reach the control plane. The heartbeat and job poll are
  outbound HTTPS to the URL in `engine.env`, so test that path directly from the
  appliance:

  ```
  curl -sS -I "$(grep -oE 'https?://[^ ]+' /etc/vacti-engine/engine.env | head -1)"
  ```

- Make sure outbound HTTPS to your control-plane URL is allowed through any
  firewall, proxy, or VPN in front of the appliance. The engine only ever dials
  out; nothing needs to be opened inbound.
- Once connectivity is restored the engine resumes heartbeating and the control
  plane brings it back automatically. If it stays disabled, re-enable it from the
  control plane.

## I need shell access on my appliance

**Why**

- For hands-on maintenance (package upgrades, reading logs, debugging) you have
  two paths. The appliance ships with a non-public local administrator account in
  the `sudo` group; for console or SSH access, request credentials from your Vacti
  licensing contact. It also runs an SSH server reachable only over your overlay
  admin tunnel, authenticated by the overlay's device identity, for key-less admin
  from the overlay.

**Fix**

- Log in at the console with the local administrator account (request credentials
  from your Vacti licensing contact), or reach the appliance over your overlay
  admin tunnel for key-less admin. Your Vacti licensing contact provides the
  overlay enrollment and setup details.
- SSH to the appliance over the public internet is not supported: the ops channel
  is deliberately overlay-only. Use the overlay admin tunnel rather than exposing
  port 22 to the internet.

## Getting more detail

- Follow the engine live while you reproduce an issue:

  ```
  journalctl -u vacti-engine.service -f
  ```

- Confirm the installed engine version:

  ```
  dpkg-query -W vacti-engine
  ```

- When a problem is really "the engine cannot reach the control plane", test that
  path directly from the engine with `curl` against the control-plane URL in
  `engine.env`.

If an engine is healthy in the control plane but a run produces nothing, the
problem is more likely engagement configuration than the appliance; see the
[user guide](/user/01-sign-in/).
