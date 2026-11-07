---
title: Reports
description: Generate and download VA, pentest, and threat-intel reports from inside each module.
sidebar:
  order: 6
---

This page shows you where to generate and download reports. Vacti does not have a single reports list. Instead, each module produces its own reports: Vulnerability Assessment on the scan pages, AI Pentest on the engagement report page, and Cyber Threat Intel on the Threat page. Generating reports needs the initiate-scans permission; Auditors can still open and edit report content.

The old `/reports` URL redirects to the Dashboard, because report generation moved into each module.

## Vulnerability Assessment reports

VA reports are produced from the scan pages (route `/scans`).

- On the **scan history** table, a finished (non-passive) scan row has a **Report** column with three links that open in a new tab:
  - **Full** opens the full report.
  - **Recon** opens the recon report.
  - **Findings** (*Temuan*) opens the findings-only report.
- On the **scan detail** page, click **Generate report** (*Buat laporan*) in the header to open the full report in a new tab.

The reports are served from `/reports/va/{scanId}`.

## AI Pentest reports

Pentest reports have the richest set of formats. Open an engagement, then click **Reports** (*Laporan*) in the engagement toolbar to reach the report page (route `/pentest/[id]/report`). The page header reads **Reports** (*Laporan*) and shows the engagement name, with **Evidence** (*Bukti*) and **Back** (*Kembali*) buttons.

You need at least one accepted finding before a report can be generated. Until then the page shows "No accepted findings yet" (*Belum ada temuan yang diterima*) with the prompt "Accept at least one finding to generate the report." See [Findings](/user/04-findings/) for how to accept findings.

### Initial report formats

The **Initial Report** (*Report Awal*) card offers these downloads and views:

- **Report EN** and **Report ID**: the PDF report in English or Indonesian (open in a new tab).
- **HTML**: an editable HTML report (see "Edit a report in the browser" below).
- **XLSX**: the findings as an Excel workbook (download).
- **Export SARIF** (*Ekspor SARIF*): SARIF 2.1.0 for GitHub code scanning and ASPM tools.
- **DOCX**: an editable Word (.docx) report.
- **Consolidated** (*Konsolidasi*): a PDF where the same finding seen on multiple targets is merged into one entry.

### Retest report formats

After you retest findings, the **Retest Report** (*Report Uji Ulang*) card offers **Retest EN**, **Retest ID**, and **Retest HTML**. A retest report includes only findings that have been retested.

### Generate and cache

When you have the initiate-scans permission, the page shows generation buttons:

- **Generate Report** renders the PDF and Excel once and caches them so every later download is instant.
- **AI report content** (*Konten report AI*) uses AI to write the description, business impact, and remediation, and attach OWASP and CWE references.
- **AI caption QA** (*QA Caption AI*) uses a vision-capable model to verify and repair screenshot captions.
- **Visual QA** renders the report to page images and uses a vision model to flag truncation, mixed languages, missing sections, or layout breakage. Results appear in a **Visual QA Results** (*Hasil Visual QA*) card.

The AI caption QA and Visual QA buttons need a vision-capable AI provider configured first; they are disabled until one is set.

### Edit a report in the browser

The **HTML** format opens an editable report with a toolbar. Click **Edit** (*Ubah*) to make the content editable, make your changes, then click **Save** (*Simpan*). The toolbar also has **Reset** (*Atur Ulang*), a **PDF** export of your saved edits, and an EN/ID language switch. Your hand-edits are saved on the server and can be re-exported to PDF.

Sibling download routes are `/reports/pentest/{id}/docx`, `/reports/pentest/{id}/xlsx`, and `/reports/pentest/{id}/sarif`.

### Report settings

The **Report Settings** (*Pengaturan Report*) card links to **Open report settings** (*Buka pengaturan report*), where you set branding, identity, classification, document control, and signatories for pentest reports (route `/pentest/report-settings`).

## Cyber Threat Intel report

On the **Cyber Threat Intel** page (route `/threat`), click **Generate report** (*Buat laporan*) in the header to open the threat-intel report for the selected workspace in a new tab. The report is served from `/reports/ti/{projectId}`.

