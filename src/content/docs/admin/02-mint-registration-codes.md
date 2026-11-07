---
title: Mint registration codes
description: Create, deliver, and revoke single-use invite codes that let a new user self-register into a workspace.
sidebar:
  order: 2
---

A registration code (also called an invite code) lets a new user self-serve a
Vacti account. No code, no account: self-registration is gated. This page walks
through minting one, giving it to the invitee, and what happens when they redeem
it.

## What a registration code is

A registration code is a web invite. The invitee types it into the Vacti sign-up
page to create their own account. Each code:

- is **single-use and expiring by default**;
- is **scoped to exactly one workspace plus one role**;
- **can never grant Super Admin** (enforced in code on top of a database CHECK);
- has its plaintext **shown once, at creation only**. Vacti stores only a hash,
  so the plaintext can never be re-displayed.

Every code begins with the prefix `vreg_` followed by grouped characters, for
example `vreg_ABCD-EFGH-...`.

### Not the same as engine enrollment

A registration code is consumed by a human at the web sign-up page. It is not an
engine enrollment token and is not entered into a pentest engine, an appliance
first-boot screen, or a `VACTI_URL` environment variable. Engine enrollment is a
separate, Super Admin only flow under Settings > Engine and credentials. See
[API tokens](/admin/05-api-tokens/) for where engine and API credentials live.

## Who can mint

The Registration codes page is visible to a Super Admin or to a Workspace Admin.
The page re-gates server-side:

- A **Super Admin** may mint for any workspace and sees every code.
- A **Workspace Admin** may mint only for a workspace they administer, and sees
  only codes for those workspaces.

A user with no admin reach is bounced away from the page. A forged request for a
workspace the actor may not administer fails closed (returns not-found).

## Open the page

1. Open the Settings area.
2. In the left navigation, under **Access control** (Kontrol akses), click
   **Registration codes** (Kode registrasi).

You will see a "Generate code" form at the top and, below it, a table of codes
you are allowed to administer.

## Mint a code: fill the form

The mint form (labeled "Generate code" / "Buat kode") takes these fields:

| Field (English / Indonesian) | Meaning | Allowed values |
| --- | --- | --- |
| Workspace (Workspace) | Which workspace the new user joins. | A workspace you administer. |
| Workspace tier (Tier workspace) | The per-workspace admin tier granted. | Member (default) or Workspace Admin (Admin Workspace). |
| Operational role (Peran operasional) | The global role granted. | Penetration Tester (default) or Auditor (read-only). |
| Bind to email (optional) (Ikat ke email) | If set, only that exact email may redeem. Leave blank for any email. | A valid email, or blank. |
| Max uses (Maks pemakaian) | How many times the code may be redeemed. | 1 to 100 (default 1). |
| Expires in (days) (Kedaluwarsa dalam) | Validity window from now. | 1 to 90 days (default 7). |

The form shows the reminder "A code can never grant Super Admin." The role
dropdown deliberately offers only Penetration Tester and Auditor. Both the
workspace tier and the operational role are re-validated server-side against a
hard ceiling, so a tampered request cannot mint Super Admin.

Max uses and expiry are clamped to their ranges server-side (1 to 100 uses, 1 to
90 days), so an out-of-range value is corrected rather than rejected.

## Mint a code: generate and copy

1. Fill the form.
2. Click **Generate code** (Buat kode).
3. A panel appears with the heading "Copy now - shown once" (Salin sekarang -
   hanya ditampilkan sekali) and the code in a monospace box.
4. Click the copy icon to copy it to the clipboard. A toast confirms "Code
   copied to clipboard."

Copy the code now. It is the only time the plaintext is shown. If you lose it,
revoke the code and mint a new one.

## Give the code to the invitee

Hand the invitee two things:

1. The **sign-up URL**: your Vacti base URL followed by `/register`. The base URL
   is the platform's configured application URL (see
   [Platform settings](/admin/03-platform-settings/)).
2. The **code** you copied.

If you bound the code to an email, tell that invitee to register with exactly
that email address.

A convenience prefilled link has the form
`https://<your-app-url>/register?code=<code>&email=<email>`. The code and email
in the link are only a convenience: the server re-validates both on redeem, so
the link is never the authority.

## Optional: email the code automatically

Vacti can email a code to its bound address, but only when the platform feature
flag **Auto-email registration codes** (`email.reg_auto_email_code`) is on. See
[Platform settings](/admin/03-platform-settings/) to enable it. When the flag is
off, codes are copy-and-paste only, and the controls below do not appear.

When the flag is on:

1. Enter a **Bind to email** value. The "Send to invitee" checkbox enables only
   when a bound email is present (an any-email code has no trusted destination).
2. Tick **"Email the code to the bound invitee"** (Kirim kode ke email invitee
   yang terikat). The email contains a prefilled register link.
3. Click Generate code. On success the panel shows "Sent to
   <email>". If delivery fails, it shows "Email could not be sent - copy the
   code and deliver it manually," and the code is still minted. A send failure
   never rolls back the mint, so you always keep the clipboard fallback.

### Sending limits

Automated delivery is rate-limited to resist abuse and protect email quota:

- a hard per-code lifetime send cap;
- per-destination, per-actor, and per-IP soft locks;
- a hard global daily cap, set by **Registration-code email daily cap**
  (`email.reg_email_daily_cap`, default 80, range 10 to 500). Keep it under your
  email provider's daily quota.

A throttled or capped send is recorded and returns without sending.

## The codes table

Below the form, each code shows:

- **Workspace** it is scoped to.
- **Role**: the workspace tier plus the global role, for example "Member -
  PenetrationTester".
- **Bound to**: the bound email, or "Any email" if unbound. If it was emailed,
  the date is shown.
- **Uses**: used count over max uses, for example "0/1".
- **Expires**: the expiry date.
- **Status**: Active, Revoked, Expired, or Used up.

### Resend (rotates the code)

If auto-email is on and a code is email-bound and still active, a **Resend
email** (Kirim ulang) action appears. Because only the hash is stored, the
original plaintext cannot be re-sent. Resend therefore **rotates** the code: it
mints a fresh code, writes the new hash, resets the used count, and emails the
new code. The previously emailed link stops working. The confirmation dialog
states this. All throttles and caps run before the rotation, so a throttled
resend never rotates or sends.

### Revoke

Click **Revoke** (Cabut) on an active code to disable it immediately. A revoked
code never validates again. You may only revoke a code for a workspace you
administer. The action is confirmed and audited.

## What happens when the invitee redeems

When the invitee submits the sign-up form at `/register`, Vacti:

1. Validates the email shape and requires a password of at least 8 characters.
2. Throttles the attempt by client IP and by the presented code hash before any
   lookup, to resist brute force.
3. Looks up the code by hash and checks it is redeemable (not revoked, not
   expired, uses remaining, and, if bound, the email matches).
4. In one transaction, atomically "burns" one use (guarding against two
   concurrent redemptions of a single-use code), creates the user with the
   granted role, and adds the workspace membership with the granted tier.
5. Re-applies the Super Admin ceiling at redemption as defense in depth: a code
   row whose role is somehow non-mintable clamps to Penetration Tester, never
   Super Admin.
6. Signs the new user in and sends them to the dashboard.

Every failure, whether a bad code or an already-taken email, returns the same
generic error, so the endpoint reveals neither which codes exist nor which
emails are registered.

## What is audited

Minting records a `regcode.create` audit entry with the non-secret scope only
(workspace tier, global role, max uses, expiry, whether it is bound). The
plaintext and hash are never written to the audit log. Revocation records
`regcode.revoke`. Email events record `regcode.email_sent`,
`regcode.email_resend`, `regcode.email_throttled`, or `regcode.email_failed`.
Redemption records `user.register` (plus the implicit first `user.login`), and a
failed redemption records `user.register_failed`. See
[Audit log](/admin/06-audit-log/).
