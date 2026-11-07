---
title: Findings
description: Review, triage, and edit findings from VA scans and from pentest engagements.
sidebar:
  order: 4
---

This page shows you how to review and triage findings. Vacti does not have one global findings list. Instead, findings live with the work that produced them: Vulnerability Assessment findings on the scan detail page, and pentest findings on the engagement detail page. Changing a finding's status, notes, or details needs the scan-results-modify permission. Auditors see findings read-only.

## VA findings (from a scan)

Open a scan (route `/scans/[id]`) and switch to the **Vulnerabilities** tab. When there are findings, the tab shows a severity donut above the findings table.

### Search and filter

- Use the search box to filter by finding name, location, or CVE. Its placeholder reads "Search findings (name, location, CVE)..." (*Cari temuan (nama, lokasi, CVE)...*).
- Use the status filter to show **All statuses** (*Semua status*) or one status.
- The count line shows how many findings match out of the total.

### Read a finding

Each row shows a severity badge and the finding name with its location. Expand the disclosures on a row to see:

- **Details (template)** (*Detail (template)*): description, remediation, CVSS score, CVE ids, and references.
- **AI analysis** (*Analisis AI*): description, impact, and remediation (when generated).
- **Request / Response**: the raw request and response.

### Triage a finding

With the scan-results-modify permission you can:

- Change a row's status with the per-row status selector, which saves instantly.
- Add or edit an analyst note. Expand **Add note** (*Tambah catatan*) or **Edit note** (*Ubah catatan*), type into the box, then click **Save note** (*Simpan catatan*).
- Select rows and use the bulk bar to set a status for all selected (**Apply to selected** / *Terapkan ke yang dipilih*), run **AI enrich** to generate AI description, impact, and remediation (also used in the report), or **Clear** (*Bersihkan*) the selection.
- Delete a finding with **Delete** (*Hapus*) and confirm.

Findings are paged 50 at a time.

## Pentest findings (from an engagement)

Open an engagement (route `/pentest/[id]`) and scroll to the **Findings** card, which is open by default.

### How findings are grouped

Pentest findings are split into buckets, each its own table:

- **Accepted (shippable)**: findings you have accepted; these appear in reports and carry retest columns.
- **Needs review (not shipped)** (*Perlu ditinjau (belum dikirim)*): findings awaiting your decision.
- **Out of scope (context-restricted)** (*Di luar scope (dibatasi konteks)*): collapsed by default.
- **rejected (kept for audit)**: collapsed by default.

A **Needs operator action** (*Perlu tindakan operator*) callout lists findings the engine handed to a human. Use the facet toolbar to filter by severity, lifecycle bucket, class, and search.

### Read a finding

Each row shows a severity badge and the finding title. The row carries the VRT or CVSS source, the MITRE ATT&CK technique, the affected location (method, URL or host, and parameter), and a detail disclosure with description, impact, remediation, steps, references, and evidence. The **Status** column shows advisory chips and the verifier's verdict ("TP - confirmed" or "FP - rejected") with its reasoning. Open the evidence popup to see captured proof.

### Triage a finding

Open the **Action** (*Aksi*) menu on a finding (when you can review) to:

- **Accept (true positive)** (*Terima (true positive)*): mark the finding shippable.
- **Reject (false positive)** (*Tolak (false positive)*): mark it a false positive.
- **Mark in-scope** or **Mark out-of-scope** (*Tandai dalam ruang lingkup* / *Tandai di luar ruang lingkup*).
- **Merge into (lossless)** (*Gabung ke (tanpa kehilangan)*): merge this finding into another; it is reversible.
- **Delete** (*Hapus*) the finding, which also removes its evidence. You confirm first.

At least one accepted finding is required before you can generate a pentest report.

### Edit severity and title

Click the pencil **Edit severity (CVSS)** (*Edit keparahan (CVSS)*) on a finding to open the inline CVSS 4.0 editor. You can change the title and adjust the exploitability and impact metrics; the base score and severity recompute live. Click **Save** (*Simpan*) or **Cancel** (*Batal*).

### Add a finding manually

Expand **Add finding** (*Tambah temuan*) above the tables to record a finding by hand. Fill in the title, severity, class, affected URL, and description.

### Deduplicate and merge

When you have accepted findings, the card header offers **Group duplicates** (*Kelompokkan duplikat*) to reconcile duplicate findings into cases, and a dedup control. Merged cases and root-cause groups show as expandable parent rows with an **Un-merge** (*Pisahkan*) option.

### Retest

After remediation, retest findings from the engagement (the **Retest** destination in the **More** menu). The accepted-findings table then shows a retest status per finding (fixed, still vulnerable, partial, or unable to verify) and the last retest time. See [Reports](/user/06-reports/) for the retest report.
