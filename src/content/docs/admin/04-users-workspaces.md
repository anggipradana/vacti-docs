---
title: Users and workspaces
description: Create, invite, role-change, deactivate, and delete users; grant workspace-admin and per-user features.
sidebar:
  order: 4
---

Settings > Users (Pengguna) is where a Super Admin manages accounts directly, as
an alternative to the self-service [registration codes](/admin/02-mint-registration-codes/)
flow.

## Who can open it

Super Admin only (requires Modify system config). A non-admin is redirected to
the dashboard.

## Add a user (with a password)

The **Add user** (Tambah pengguna) card creates an account with a password you
set:

1. Enter the user's **Email**.
2. Enter a **Password** of at least 8 characters.
3. Choose a **Role**: Super Admin, Penetration Tester (default), or Auditor
   (read-only).
4. Click **Add user**.

Errors are shown inline, for example "A user with that email already exists" or
"Password must be at least 8 characters."

## Invite a user (passwordless OTP)

The **Invite user (passwordless OTP)** (Undang pengguna) card creates a
passwordless account that signs in with an emailed one-time code:

1. Enter the **Email**.
2. Optionally enter a **Full name**.
3. Choose a **Role**.
4. Click **Invite user**.

On success you see "Invite sent. The user can now sign in with a one-time code
emailed to them." Delivery of the actual email depends on the Send invite emails
platform flag and a configured email provider.

Workspace assignment is not part of this minimal form; assign workspaces
separately. For a workspace-scoped self-service onboarding, prefer a registration
code instead.

## The users and roles list

Each user row shows their email, status badges, and current role, plus action
controls.

Badges you may see:

- **you** (Anda): your own account.
- **Active** (Aktif) or **Deactivated** (Nonaktif).
- **Bug Bounty** and **CTF**: the per-user feature grants, when enabled.
- A per-workspace **"<Workspace> Admin"** badge for each workspace where the user
  holds the admin tier.

## Change a user's global role

Each row has a role dropdown and a **Save** button. Choose Super Admin,
Penetration Tester, or Auditor and click Save.

You cannot demote yourself out of the last active Super Admin seat. If you try,
the UI message is "That is the last active Super Admin. Promote another admin
first." A deactivated admin does not count toward that floor, because they cannot
log in to recover.

## Per-user feature grants

For any non-Super-Admin user, two toggles appear (Super Admins always have both,
so no toggle is shown):

- **Enable Bug Bounty / Disable Bug Bounty** (Aktifkan / Nonaktifkan Bug Bounty).
- **Enable CTF / Disable CTF** (Aktifkan / Nonaktifkan CTF).

These grants only reveal the feature surface. The underlying actions still
require their own permission.

## Reset a password

Each row has a **Reset password** (Reset password) control: type a new password
of at least 8 characters and submit. Resetting a password revokes all of that
user's sessions (they are signed out everywhere) and records a
`user.password_reset` audit entry.

## Deactivate, reactivate, delete

Prefer **Deactivate** over Delete so the user's record and audit trail are kept.

- **Deactivate** (Nonaktifkan): the user is signed out everywhere and cannot log
  in until reactivated. Their record and audit trail are kept. You cannot
  deactivate your own account. The action is confirmed.
- **Reactivate** (Aktifkan): restores a deactivated user.
- **Delete** (Hapus): permanent, cannot be undone. The confirmation reminds you
  to prefer Deactivate to keep the audit trail. You cannot delete your own
  account.

### Resend a lost invite

For a passwordless (OTP-only) account that has never logged in and was created
more than 30 days ago, a **Resend invite email** (Kirim ulang undangan) control
appears so you can re-send the one-time-code email.

## Role summary shown on the page

The page footer restates the model: Auditor is read-only plus reports;
Penetration Tester covers scans, results, targets, and reports but no system
config; Super Admin is everything across all workspaces including integrations
and user roles. A "<Workspace> Admin" badge is a per-workspace tier, orthogonal
to the global role. Bug Bounty is a separate per-user feature, off by default.

## Workspaces

Workspaces (projects) are managed under Settings > Workspaces (Workspace), which
is Super Admin only. A workspace is the tenancy boundary: users are members of
workspaces, registration codes are scoped to one workspace, and the per-workspace
admin tier is held on the membership.

The per-workspace admin tier (`admin` or `member`) is what makes a user a
Workspace Admin for that workspace. A Workspace Admin can mint registration
codes for the workspace they administer, but the admin flag never grants read
access into other workspaces' data.

Workspace and membership changes are audited with `project.*` actions, for
example `project.create`, `project.member_added`, and
`project.member_role_change`. See [Audit log](/admin/06-audit-log/).
