---
title: Run a scan
description: Add a target and run a vulnerability-assessment scan, then watch its progress.
sidebar:
  order: 3
---

This page shows you how to add a target domain and run a Vulnerability Assessment (VA) scan against it, then monitor the scan while it runs. Starting a scan needs the initiate-scans permission; adding or editing targets needs the targets-modify permission. Auditors cannot start scans.

Open **Vulnerability Assessment** from the top navigation (route `/scans`). The page title reads **Vulnerability Assessment** and the description is "Recon runs across your targets." (*Proses recon pada target Anda.*)

## Pick your workspace

In the page header, use the workspace switcher to select the workspace whose targets you want to scan. The list of targets, scans, and findings below reflects the selected workspace.

## Add a target

Targets are managed in the **Targets** panel at the bottom of the Vulnerability Assessment page. The panel opens automatically when a workspace has no targets yet.

1. In the add-target form, fill in:
   - **Project** (*Proyek*): the workspace this target belongs to.
   - **Domain** (*Domain*): the target host, for example `example.com`.
   - **Predefined subdomains** (*Subdomain yang ditentukan*): optional, space-separated, for example `a.example.com b.example.com`. Leave empty to let Vacti discover subdomains automatically.
   - **Custom request headers** (*Header request kustom*): optional, one per line, for example `Authorization: Bearer ...` or `X-Api-Key: ...`.
2. Click **Add target** (*Tambah target*).

Each target row shows the domain, a **custom headers** badge when headers are set, and either a count of **predefined subs** or a **discovery on** (*discovery aktif*) badge. Use **Edit** (*Ubah*) to change a target, **Notes** (*Catatan*) to open per-target recon notes, and **Delete** (*Hapus*) to remove a target and all its scans.

## Start a scan

1. In the page header, click **New scan** (the button shows a plus icon).
2. In the **Start a scan** dialog, set:
   - **Target**: choose one of the workspace's targets.
   - **Mode**, one of:
     - **Active (binary recon pipeline)**: runs the recon arsenal against the target.
     - **Passive (OSINT only - no traffic to target)**: pulls OSINT (for example VirusTotal and Wayback) with no traffic to the target.
     - **Full (passive discovery, then active)**: does passive discovery first, then the active pipeline.
   - **Timeout (menit)** (timeout in minutes): how long each tool may run. Default 60, up to 600 (10 hours) for large multi-domain scans.
   - **Deep-fetch discovered URLs (passive/full)**: optional checkbox that fetches response bodies (with an SSRF guard) to scan for secrets.
   - **Scan profile**: shown only when profiles exist. Leave as **Default (all stages)** or pick a saved profile.
   - **Run on engine**: an optional engine preference, shown when engines are enrolled. This is recorded as a preference.
3. Click **Start scan**. The button shows "Starting..." while the scan is created.

## Watch a scan run

While a scan is queued or running, the page refreshes on its own.

- The **Running now** (*Sedang berjalan*) band shows each active scan as a card with the target domain, a status pill, and a stage stepper. For an active or full scan the stepper walks the recon arsenal through its stages - subdomain discovery, live-host probing, port scanning, vulnerability scanning, and CMS/WordPress checks. For a passive scan the single stage is `passive`.
- Each running card has a **Cancel** (*Batalkan*) button.
- The **Running now** stat card at the top shows how many scans are in progress.

### Scan history

Below the running band is the scan history table. Columns are **Target**, **Mode**, **Status**, **Findings**, **Duration**, **Started**, and **Report**. Use the filter bar to narrow by status, mode, or target, and to sort by **Newest** (*Terbaru*), **Oldest** (*Terlama*), or **Most findings** (*Temuan terbanyak*); then click **Apply** (*Terapkan*). Click a target to open the scan detail page.

## The scan detail page

Open a scan to see its full results (route `/scans/[id]`).

- The header shows the target domain and a status pill. While the scan is not finished and you have the initiate-scans permission, a **Cancel scan** (*Batalkan scan*) button is available. Once finished, you can **Delete scan** (*Hapus scan*).
- For an active or full scan the header also offers **Attack Path** (*Jalur Serangan*) and **Generate report** (*Buat laporan*). For a passive scan it offers **View on Attack Surface** (*Lihat di Attack Surface*).
- A **progress card** shows the stage stepper and an activity timeline.
- Results are grouped into tabs: **Endpoints**, **Ports**, **Subdomains**, and **Vulnerabilities**, each with a count. The Vulnerabilities tab holds the findings table covered in [Findings](/user/04-findings/).

### Compare and rescan

When a scan has finished, the detail page offers a compare-and-rescan card:

- **Compare with an earlier scan** (*Bandingkan dengan scan sebelumnya*): pick an earlier completed scan of the same target and click **Compare** (*Bandingkan*) to see added, removed, and unchanged subdomains, endpoints, ports, and vulnerabilities.
- **Rescan** (*Rescan*): re-run the scan. For an active scan you can uncheck individual stages (subdomain discovery, live-host probing, port scanning, vulnerability scanning, CMS/WordPress checks) to run a partial sub-scan; for a passive scan it re-runs OSINT only.

## Attack path

For an active or full scan, open **Attack Path** (route `/scans/[id]/attack-path`) to see your in-scope findings laid out as a kill chain. The page has an **Overview** (*Ringkasan*) count strip, an interactive **Kill Chain** (*Jalur Serangan*) graph grouping findings by host across phases (recon, initial access, privilege escalation, lateral movement, impact), and a **Findings Map** (*Peta Temuan*) host-by-severity heatmap. Findings marked as false positives are excluded.

