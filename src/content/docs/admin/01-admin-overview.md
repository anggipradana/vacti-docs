---
title: Admin overview
description: Roles, workspace tiers, and what each administrator can do in Vacti.
sidebar:
  order: 1
---

Vacti separates two independent kinds of authority. Understand both before you
manage users, mint registration codes, or change platform settings.

## Two orthogonal access systems

1. **Global operational role**. This decides which verbs you may run anywhere you
   are a member. There are exactly three roles.
2. **Per-workspace admin tier**. This decides how much of one workspace you
   administer. There are exactly two tiers: admin and member. A workspace admin
   manages that one workspace, nothing else.

A user can be, for example, a global Penetration Tester who is also a Workspace
Admin on the "Acme" workspace. The only cross-workspace principal is Super
Admin.

## Global roles

| Role | What it can do |
| --- | --- |
| Super Admin | Everything, across every workspace: platform settings, users, roles, API tokens, integrations, engine enrollment, audit log. |
| Penetration Tester | All permissions except Modify system config: run scans, modify targets, modify scan results, write reports. |
| Auditor (read-only) | Read access plus Modify reports only. |

## The permission matrix

Permissions are fixed and are never editable at runtime. There are no custom
roles. The matrix is:

| Permission | Super Admin | Penetration Tester | Auditor |
| --- | --- | --- | --- |
| Modify system config | yes | no | no |
| Modify scan config | yes | yes | no |
| Modify scan results | yes | yes | no |
| Modify reports | yes | yes | yes |
| Initiate scans | yes | yes | no |
| Modify targets | yes | yes | no |

A user with no recognized role falls back to the least-privileged role
(Auditor, read-only), never to Penetration Tester. An unspecified or corrupted
role fails closed.

You can view this same matrix read-only in the web UI under Settings > Roles and
permissions.

## Workspace admin tier

A user is a workspace admin of a project if they are a global Super Admin, or
they have been granted the admin tier on that project. In the Users list, a
workspace-admin grant shows as a dynamic badge, for example "Acme Admin".

A workspace admin can mint registration codes for the workspace they administer
(see the next page). The admin tier only unlocks bounded management verbs on that
one project. It is never a read-bypass into other workspaces' data.

## Per-user feature entitlements

Two product surfaces are gated per user, orthogonal to the role matrix:

- **Bug Bounty**. Off by default. A Super Admin grants it per user from
  Settings > Users. Super Admins always have it.
- **CTF**. Off by default, granted the same way. Super Admins always have it.

Holding a feature flag does not grant any verb. The underlying actions still
require their own permission on top (for example Modify scan config to configure
a program).

## What each admin surface requires

| Settings surface | Who can open it |
| --- | --- |
| My account | any signed-in user |
| Scan profiles, Schedules, Reports and branding | role-dependent per page |
| Registration codes | Super Admin, or a Workspace Admin |
| Users, Roles and permissions, API tokens, Audit log | Super Admin only |
| Platform, Branding, Web Hack List | Super Admin only |
| Workspaces, Integrations, Notifications, Leaks access | Super Admin only |
| Network, Egress VPN, Backup | Super Admin only |
| Engine and credentials | Initiate scans to view the fleet; engine enrollment is Super Admin only |

The settings navigation hides items a user may not use, but that is only a
display filter. Every page enforces its own permission gate server-side, and
every secret-writing server action re-checks the permission independently. The
nav filter is never the security boundary.

## Where authority is created

- The **first Super Admin** is created by the first-run bootstrap.
- Further Super Admins are created only by an existing Super Admin in
  Settings > Users.
- A **registration code can never grant Super Admin**. It can at most create a
  Penetration Tester or Auditor, optionally with the Workspace Admin tier. This
  is enforced in code on top of a database CHECK constraint, so even a leaked
  code can never create a platform owner.

Continue to the next pages for the step-by-step operations: minting
registration codes, platform settings, user and workspace management, API
tokens, and the audit log.
