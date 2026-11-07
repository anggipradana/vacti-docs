---
title: Attack Surface
description: Discover your external footprint through passive OSINT, review exposure findings, and export the inventory.
sidebar:
  order: 2
---

Attack Surface is the product you use to see what your organization exposes to the internet without touching the target. It builds an inventory of discovered URLs, exposure findings, and IP resolutions from passive OSINT sources, so you can understand your external footprint before you run an active assessment.

Open it from the top navigation as **Attack Surface** (route `/surface`). The page description reads "Passive OSINT discovery (VirusTotal + Wayback): URLs, exposure findings, and IP resolutions."

## Who can use it

- Anyone signed in to a workspace can open Attack Surface and read its inventory.
- Running passive recon and changing the status of an exposure finding need the scan-results-modify permission.
- The CSV and ZIP exports are limited to operator roles, because the findings export can carry unmasked, credential-like snippets.

Everything is scoped to the workspace you pick in the header switcher. If a workspace has no targets yet, the page asks you to create one first.

## How the surface is populated

Attack Surface fills up from passive discovery, which never sends traffic to the target. You populate it two ways:

- Click **Run passive recon** on this page.
- Run a **Passive** or **Full** scan from Vulnerability Assessment. A passive scan's results land here rather than on a scan report.

Passive discovery uses public OSINT sources such as VirusTotal and Wayback and never sends traffic to the target.

## What you see at a glance

A posture band leads the page:

- An **Exposure severity** donut that folds exposure findings into risk tiers.
- Tiles for **Discovered URLs**, **Exposure findings**, **IP resolutions**, and **Exposure types**.

Below that, a **URL discovery** sparkline shows how many URLs were discovered per day over the last 14 days, so you can see when your footprint grew.

## Exposure findings

The **Exposure findings** card is the heart of the page. It lists things passive discovery flagged as sensitive or risky, grouped and filterable by type. You can search and filter the findings, and if you have the scan-results-modify permission you can set a triage status on each one. Credential-class exposure findings also count toward the risk score and overlap with leaked credentials shown in Cyber Threat Intelligence.

## Discovery details

A secondary card holds three tabs:

- **Discovered URLs**: every URL found for the workspace. A relationship graph sits above the table; clicking a host or category in the graph filters the table below. You can also filter by category or search the URL text, and page through the results. Each row links out to the URL and shows its category and which source it was seen via.
- **Endpoints and params**: parameters and auth or admin endpoints derived from the discovered URLs, with the top parameters and a list of likely login or admin endpoints.
- **IP directory**: the IP addresses your hostnames resolve to, with the hostnames seen on each and when they were last resolved. This tab fills in once passive DNS data is available.

## Focus on what is new

Use the **Diff** control to show only what a single scan newly discovered. Pick a completed passive or full scan from the dropdown and apply it; the URL table, graph, and exposure findings then show only the new discoveries from that scan. Clear the diff to return to the full inventory.

## Export the inventory

The **Export** menu in the header gives you:

- A full ZIP containing three CSV files: discovered URLs, exposure findings, and IP resolutions.
- A URLs-only CSV.
- A findings-only CSV.

Exports are an operator-role action because the findings file can contain sensitive, credential-like snippets in the clear.

## How it fits with the other products

Attack Surface is the passive, no-touch view of your footprint. Vulnerability Assessment is the active assessment that confirms real weaknesses, and Cyber Threat Intelligence surfaces a summary of your passive exposure findings alongside leaked credentials and the unified risk score. The three share the same workspace and targets, so discovery here informs the scans and risk picture elsewhere.
