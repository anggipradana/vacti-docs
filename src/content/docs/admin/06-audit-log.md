---
title: Audit log
description: Search the tamper-evident record of administrative and security-relevant actions.
sidebar:
  order: 6
---

Settings > Audit log (Log audit) is the searchable record of mutating and
security-relevant actions across the platform. It answers who did what, when, and
from where.

## Who can open it

Super Admin only (requires Modify system config). A non-admin is redirected to
the dashboard.

Opening the audit log is itself audited: each view records an `audit.viewed`
entry capturing the active filters and the result count, never the content of any
viewed row. This is the "who watched the watchers" record.

## What the table shows

Each entry has:

- **When** (Waktu): the timestamp, shown in UTC.
- **Actor** (Pelaku): the acting user's email, or "system" for actions with no
  user actor.
- **Action** (Aksi): the action name, for example `regcode.create`.
- **Resource** (Sumber Daya): the affected resource identifier, for example
  `regcode:<id>` or `user:<id>`.
- **Details** (Rincian): a "View" (Lihat) expander that reveals the correlation
  fields and metadata: `session_id`, `request_id`, `client_ip`, `user_agent`, and
  a `metadata` JSON blob. Secrets are never stored in metadata.

Entries are paginated (50 per page).

## Filtering

The filter bar is a shareable, URL-driven form. You can filter by:

- **From** and **To** date range. The default is the last 30 days, so a full
  month is visible without any filtering. Dates are interpreted in UTC.
- **Actor** (Pelaku): any actor, the special "system" actor (actions with no
  user), or a specific user chosen from the dropdown of users who appear in the
  current range.
- **Action** (Aksi): any action, or one specific action from the dropdown of
  actions that occur in the current range.

Click **Apply** (Terapkan). Changing a filter resets to page 1; filters are
preserved across pagination.

## Actions you will see

Administrative actions recorded include, among others:

- Users: `user.create`, `user.invite`, `user.invite_resend`, `user.delete`,
  `user.deactivate`, `user.reactivate`, `user.role_change`,
  `user.password_reset`, `user.bugbounty_access`, `user.ctf_access`,
  `user.register`, `user.register_failed`, `user.bootstrap_admin`.
- Sessions: `session.destroy`, `session.expired`,
  `session.auto_revoke_deactivated`.
- Workspaces and tenancy: `project.create`, `project.update`, `project.delete`,
  `project.set_default`, `project.member_added`, `project.member_role_change`,
  `project.member_removed`.
- Registration codes: `regcode.create`, `regcode.revoke`, `regcode.email_sent`,
  `regcode.email_resend`, `regcode.email_throttled`, `regcode.email_failed`.
- API tokens: `token.create`, `token.revoke`.
- Authorization: `authz.denied`, `tenancy.denied`.
- Audit access: `audit.viewed`.

The Action dropdown only lists actions that actually occur in the selected date
range, so your available options depend on the window.

## Retention and cold storage

The table you browse is the **hot store**: recent, searchable entries. Older
entries are moved to cold storage rather than deleted.

The retention window is set by the **Audit-log retention (days)** platform setting
(see [Platform settings](/admin/03-platform-settings/)). The note at the top of
the page reflects the current value:

- When retention is a positive number, entries older than that many days are
  automatically archived to cold storage (compressed NDJSON files under the
  `audit-archive/` directory on the server data volume) by the daily worker, then
  removed from the hot table. Nothing is deleted; archived entries stay on disk
  and can be retrieved by an administrator from that directory.
- When retention is set to 0 or below, pruning is disabled entirely: every entry
  is kept in the table forever, and nothing is archived.

Because the audit log is append-only and archival rather than deletion-based, it
serves as a durable, tamper-evident trail for compliance and incident review.
