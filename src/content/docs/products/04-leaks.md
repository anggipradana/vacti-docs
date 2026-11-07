---
title: Leaks
description: Search leaked credentials by email, domain, username, phone, or name, and save results as cases.
sidebar:
  order: 4
---

Leaks is the standalone search tool for breached and leaked credentials. You type a term (an email, domain, username, phone, or name) and Vacti searches leak sources for matching records, grouped by the breach they came from. Searches are ephemeral by default: nothing is stored unless you choose to save a result as a Case.

Open it from the top navigation as **Leaks** (route `/leaks`). The page description reads "Search leaked credentials by email, domain, username, phone or name. Save findings as Cases."

## Who can use it

Leaks needs the initiate-scans permission, so SuperAdmin and PenetrationTester can use it and Auditor cannot. A Leaks search is not tied to a specific workspace, though a saved Case can be attached to one.

A quota chip in the header shows how many searches you have left today, for example "N left today", and turns red when you reach zero. A SuperAdmin sees **Unlimited**. Each search you run, including re-running a saved Case, consumes one quota unit.

## Search for leaks

On the **Search** tab:

1. In the **Query** field, enter an email, domain, username, phone, or name.
2. Optionally open **Advanced** to set:
   - **Type**: `auto`, `email`, `domain`, `username`, `phone`, `hash`, or `keyword`. The default is `auto`.
   - **Max results**: 100, 300, 500, or 1000. The default is 100.
3. Click **Search**. The button shows "Searching..." while it runs.

If a source does not answer, Vacti shows a "Partial results" banner and still lists what the other sources found. If you hit your daily limit it shows "Search limit reached", and if nothing matches it shows "No leaks found".

## Read and interpret results

Results are grouped by source, which is the breach or database name each record came from. Each group has a heading with the source name, a result count, and sometimes a short note about the breach. The columns you see are whatever that database actually returned, so they differ from one group to the next. Leading columns like email, username, name, and phone come first; password-like columns come last.

- Password and hash columns are masked as dots. Click the eye icon on a cell to reveal that one value, or use **Reveal all** or **Hide all** to toggle every password at once. Revealing happens in your browser.
- The summary line tells you how many results matched across how many sources.

### How to interpret what you find

- A hit means the term appeared in a breach dataset, not that the account is currently compromised. Treat it as a lead to verify, for example by forcing a password reset.
- Different sources can report the same person with different fields; read each group on its own terms.
- The result count is bounded by your Max results setting and by what each source returns, so a large breach may be truncated. Raise Max results if you need more depth.

## Save a case

To keep a result set for later:

1. Click **Save as Case** on a result set.
2. Enter a **Case name** (it defaults to your query).
3. Click **Save**.

Leaked data only persists when you deliberately save a case; live searches are not kept. The case then appears on the **Cases** tab.

## Review cases

The **Cases** tab lists your saved cases as cards showing the name, when it was saved, the query, and a hit and source count. Use the filter box to narrow the list, and click a card to open it.

On a case you can:

- Edit the case details: the name, a workspace to attach it to, tags, and a note.
- **Export CSV**, **Re-run** the query (which overwrites the saved snapshot and consumes one quota unit), or **Delete** the case.
- Review each result row, reveal its password, and set a triage status of `new`, `reviewed`, `confirmed`, or `false_positive`.

## Export

You can download results as a CSV from a live search result set and from a saved case. CSV is the only export format.

## Limits to keep in mind

- Searches cost a quota unit each and are capped per day unless you are a SuperAdmin.
- Live searches are not kept; only saved Cases persist, and their passwords stay masked until you reveal them.
- The number of records returned is bounded by your Max results choice and by each source, so treat a full result set as a sample rather than an exhaustive list.
- Leaks searches any term you enter, so this is distinct from the leaked credentials shown in [Cyber Threat Intelligence](/products/03-cti/), which tracks credentials tied to a specific workspace.
