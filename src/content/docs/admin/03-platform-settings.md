---
title: Platform settings
description: Runtime operational flags a Super Admin can change without a restart.
sidebar:
  order: 3
---

Settings > Platform holds runtime operational settings a Super Admin can change
without a restart. A saved value overrides its environment variable instantly
across all replicas. This is designed for incident response, for example turning
off an external login provider during an outage.

## Who can open it

Super Admin only (requires Modify system config). The page is defended in depth:
the navigation hides it for non-admins, the page redirects a non-admin to the
dashboard, and the save action re-checks the permission independently.

## How precedence works

Every setting resolves with **DB-wins, then env, then default**:

1. a valid value saved in the database wins;
2. otherwise the environment variable value;
3. otherwise the built-in default.

Each row shows a badge for where its current value comes from: **DB**, **ENV**,
or **DEFAULT**. Because no database rows exist until you save one, a fresh deploy
behaves exactly like the environment-only system. A corrupt or out-of-contract
saved value fails safe back to the env or default and never breaks a hot path
such as login or email.

Secrets are never in this registry. Only non-secret operational flags appear
here. You cannot store an API key, password, or token on this page.

## Using the page

Settings are grouped into cards: Authentication, Email, Audit, General, and Web
Hack List. For each setting you see its label, a source badge, an input
appropriate to its type (checkbox, number, text, or dropdown), and a short help
line. Edit the values you want, then click **Save** (Simpan) on that group's
card.

Some changes prompt a confirmation dialog before the save runs, because they can
have production impact. The confirmation is a UX guard only; the server action
re-validates and permission-gates independently.

## Settings you may touch

The following are the operator-facing flags. Labels are shown English first,
with the Indonesian label in parentheses.

### Authentication

- **Stytch email-OTP login** (`auth.stytch_enabled`, Login OTP email Stytch).
  Default off. When on, users sign in with an email one-time code. Turn it off
  for password-only login, for example during a Stytch outage. Password login is
  always available regardless. Turning it off prompts a confirmation.
- **Stytch API environment** (`auth.stytch_env`, Lingkungan API Stytch). Values
  `test` or `live`, default `live`. Selects which Stytch backend and which
  project-id plus secret pair from the environment is used. Secrets never leave
  the environment. Flipping invalidates in-flight one-time codes, so change it
  during low traffic. If the chosen environment has no credential pair, OTP login
  goes inert (password-only) rather than breaking. Flipping prompts a
  confirmation.

### Email

- **Send invite emails** (`email.resend_send_invites`, Kirim email undangan).
  Default off. When on, the OTP-login invite template is actually emailed; when
  off, the invite is logged only. Requires an email provider API key to be
  configured.
- **Auto-email registration codes** (`email.reg_auto_email_code`, Email otomatis
  kode registrasi). Default off. When on, a newly minted registration code can be
  emailed to its bound address and the "Send to invitee" control appears on the
  Registration codes page. When off, codes are copy-and-paste only. Requires
  SPF/DKIM alignment for the From address. See
  [Mint registration codes](/admin/02-mint-registration-codes/).
- **Registration-code email daily cap** (`email.reg_email_daily_cap`, Batas
  harian email kode registrasi). Default 80, range 10 to 500. The hard global
  per-day limit on registration-code emails. Keep it under your email provider's
  daily quota.
- **From address** (`email.mail_from`, Alamat pengirim). The From header on
  outgoing email. Must be a valid email address. Changing it to an address
  without SPF/DKIM alignment can silently kill deliverability, so this change
  prompts a confirmation.

### General

- **Application base URL** (`general.app_url`, URL dasar aplikasi). The base URL
  embedded in login and registration email links, and the base of the `/register`
  invite links. Must be a valid URL including the scheme. A wrong value ships
  broken links in emails, so this change prompts a confirmation.

### Audit

- **Audit-log retention (days)** (`audit.retention_days`, Retensi log audit).
  Default 365. How many days of audit log stay in the hot table before the daily
  worker archives older entries to cold storage and prunes them. A value of 0 or
  below disables pruning entirely (keep forever). A value below 30 days prompts a
  confirmation because it may violate a compliance window. See
  [Audit log](/admin/06-audit-log/).

### Web Hack List

The Web Hack List group controls the optional scheduled mirror of an upstream
web-research index. These are reference-layer tuning flags; most operators leave
them at their defaults.

- **webhacklist auto-mirror** (`webhacklist.sync_enabled`, Mirror otomatis
  webhacklist). Default off. When on, the worker polls the upstream index on a
  schedule and stages new entries into a review queue under Settings > Web Hack
  List. It never publishes anything on its own; every entry still needs operator
  approval. Flipping prompts a confirmation.
- **Extra allow tags** (`webhacklist.tag_allowlist`, Tag izin tambahan).
  Comma-separated tags treated as standard in-scope research, added on top of the
  built-in list.
- **Extra flag tags** (`webhacklist.tag_flaglist`, Tag tandai tambahan).
  Comma-separated tags that force mandatory one-by-one human review, added on top
  of the built-in list.
- **Extra reject tags** (`webhacklist.tag_blocklist`, Tag tolak tambahan).
  Comma-separated tags to auto-reject, added on top of the built-in list.

## After saving

On success the page shows "Settings saved." If nothing changed it shows "No
changes to save." An invalid value is rejected with an error naming the offending
key, and the change is not saved. A saved value propagates to all replicas
promptly through a database notification, with a short time-to-live cache as a
backstop, so there is no restart.
