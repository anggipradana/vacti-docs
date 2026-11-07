---
title: Sign in
description: Sign in to your Vacti control plane, set up two-factor auth, and understand your role.
sidebar:
  order: 1
---

This page shows you how to sign in to your Vacti control plane, register with an invite code, complete a two-factor challenge, and understand which role you hold. After signing in you land on the Dashboard.

## Open the sign-in page

Browse to your Vacti control plane in a web browser. If you are not signed in, Vacti shows the sign-in card.

The sign-in card title reads **Sign in** (Indonesian: *Masuk*). It has:

- **Email** field. Enter the email address of your account.
- **Password** field (*Kata sandi*).
- **Remember me** checkbox (*Ingat saya*), with the note "Stay signed in on this browser for 7 days". Tick it to keep a 7-day session in that browser. Leave it unticked for a normal session.
- A **Sign in** button (*Masuk*).

Enter your email and password, optionally tick **Remember me**, then click **Sign in**.

### Sign-in errors

If the sign-in fails, Vacti shows a red alert above the form:

- "Incorrect email or password." (*Email atau kata sandi salah.*)
- "Too many failed attempts. Please try again in about 15 minutes." appears after repeated failures, because the account is temporarily locked.

### Language

The whole app is bilingual (English and Indonesian). Labels switch with your locale. This guide lists the English label first and the Indonesian equivalent in parentheses where it helps.

## First-run bootstrap

The very first time a brand-new control plane is opened, there are no users yet. The sign-in card instead reads **Create the first admin** (*Buat admin pertama*). Enter an email and a password of at least 8 characters, then click **Create admin & continue** (*Buat admin & lanjutkan*).

The note under the card states "This account becomes the SysAdmin." This first account is the global SuperAdmin (god-mode) for the control plane. You only see this screen once, before any other account exists.

## Email one-time-code sign-in (when enabled)

If your operator has enabled email one-time-code login, the password form is replaced by an email-code card. In that mode you enter your email and receive a one-time code to sign in. This is off by default, so most installs use the email-and-password form above.

## Register with an invite code

If you were sent an invite code, you can create your own account.

1. On the sign-in page, click **Register** (*Daftar*) under "Have an invite code?".
2. On the registration card titled **Register with an invite code** (*Daftar dengan kode undangan*), fill in:
   - **Email** (*Email*).
   - **Password** (*Kata sandi*), at least 8 characters.
   - **Invite code** (*Kode undangan*), in the form `vreg-XXXX-XXXX-...`.
3. Click **Create account** (*Buat akun*).

If the invite link was sent by email, the email and code may already be filled in for you.

The role your new account receives is decided by the invite code, not chosen by you. An invite code can only create a Penetration Tester or an Auditor account, never a SuperAdmin.

If registration fails, Vacti shows a deliberately generic message: "That invite code is not valid, or an account with that email already exists."

## Two-factor authentication

If your account has two-factor authentication turned on, Vacti challenges you after you enter the correct password. You are taken to the **Two-factor authentication** screen (*Autentikasi dua faktor*).

1. Enter the **Authentication code** (*Kode autentikasi*): the 6-digit code from your authenticator app, or one of your recovery codes.
2. Click **Verify** (*Verifikasi*).

If you entered the wrong account, click **Cancel and sign in as a different user** (*Batal dan masuk sebagai pengguna lain*) to return to the sign-in page.

A real session is only created after the code verifies.

### Turn on two-factor for your own account

Enable two-factor on your account from **Settings > Account**. The account page has a two-factor section where you set up an authenticator app and store recovery codes.

## Roles you can hold

Vacti enforces access server-side. Your account has one global role, and separately a per-workspace tier.

### Global roles

- **SuperAdmin** has every permission, across all workspaces and the platform infrastructure. This is the first-run admin and any account later promoted in **Settings > Users**.
- **Penetration Tester** has every permission except changing system configuration. Testers run scans, run pentest engagements, edit findings, and edit reports.
- **Auditor** is read-only except for editing reports. An Auditor cannot start scans or change targets.

An account with no recognized role falls back to Auditor (the least-privileged tier), never to a higher one.

### Per-workspace tier

Independently of your global role, you can be an **Admin** or a **Member** of each workspace you belong to. A workspace Admin manages that one workspace (its members and settings); a Member works inside it. A SuperAdmin is the only account that spans every workspace.

Where a screen or action needs a specific role, this guide notes it. If a page is hidden or redirects you to the Dashboard, your role does not grant access to it.

