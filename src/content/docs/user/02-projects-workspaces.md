---
title: Projects and workspaces
description: Create workspaces that scope your targets, scans, and findings, and add members to them.
sidebar:
  order: 2
---

A workspace is the container that scopes your targets, scans, findings, and threat-intel data. You create and manage workspaces in Settings, add members to them, and switch between them on the feature pages.

In Vacti the terms "project" and "workspace" refer to the same thing. The on-screen label is **workspace**, and the create button reads **Create workspace**.

## Where workspaces live

Workspace management is under **Settings > Projects**. The old `/projects` URL still works and redirects you there.

The page description reads "Workspaces that scope your targets, scans, and findings." (*Workspace yang membatasi target, scan, dan temuan Anda.*)

### Who can open this page

This page lists every workspace and every member's email, so it is gated. You need the system-configuration permission to open it. A SuperAdmin always can. If your role does not allow it, Vacti redirects you to the Dashboard.

Managing workspace contents (edit, delete, members) also needs the targets-modify permission. Without it you see the list in read-only form.

## Create a workspace

1. Open **Settings > Projects**.
2. In the create card on the left, fill in:
   - **Name** (*Nama*), for example `Acme Corp`.
   - **Slug** (*Slug*), lowercase letters, numbers, and hyphens, for example `acme-corp`.
3. Click **Create workspace** (*Buat workspace*).

If the name or slug is missing or malformed, Vacti shows "Enter a name and a slug (lowercase letters, numbers, hyphens)."

## Set the default workspace

Each account has one default workspace, marked with a **Default** badge in the list. On a workspace that is not the default, click **Set default** (*Jadikan default*) to make it the default.

## Edit a workspace

On a workspace card, expand **Edit** (*Ubah*) to change:

- **Name** (*Nama*).
- **Sector** (*Sektor*), chosen from the predefined sector list. The sector is used by the threat-intel features.
- **Slug** (*Slug*).

Click **Save** (*Simpan*) to apply.

## Manage members

Each workspace card has a **Members** (*Anggota*) section.

### Add a member

1. In the member row at the bottom of the card, enter the person's email in **Member email** (*Email anggota*).
2. Choose the workspace tier: **Member** (*Anggota*) or **Admin** (*Admin*).
3. Click **Add member** (*Tambah anggota*).

If no account exists with that email, Vacti shows "No user found with that email address." The person must already have a Vacti account (created at first-run, by a SuperAdmin, or via an invite code).

### Change a member's tier

Each member row has a tier selector (**Member** or **Admin**) and a **Save** (*Simpan*) button. A workspace Admin is shown with a dynamic badge such as "Acme Admin"; a plain member shows a **member** (*anggota*) badge.

The per-workspace tier is separate from your global role. A workspace Admin administers that one workspace; a Member works inside it.

### Remove a member

Click **Remove** (*Hapus*) on a member row and confirm. A workspace must keep at least one member, so Vacti blocks the removal of the last one with "A workspace must keep at least one member."

## Delete a workspace

Click **Delete** (*Hapus*) on a workspace card. You must confirm, because deleting a workspace also deletes all of its targets, scans, findings, and threat-intel data, and the action cannot be undone.

## Switch workspaces on feature pages

Feature pages such as Vulnerability Assessment show a workspace switcher in the page header. Use it to point a page at a specific workspace. The switcher updates the `project` value in the page URL, so your current workspace is preserved in bookmarks and links.

## Targets belong to a workspace

Targets (the domains you scan) are scoped to a workspace. You add and manage them from within the Vulnerability Assessment page rather than on a separate top-level page. See [Run a scan](/user/03-run-a-scan/) for how to add a target and start a scan.
