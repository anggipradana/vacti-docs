---
title: Cyber Threat Intelligence
description: Review a workspace's unified risk score, threat feeds, leaked credentials, and monitored assets.
sidebar:
  order: 3
---

Cyber Threat Intelligence (CTI) is the product you use to see a workspace's security posture in one place. It pulls external threat feeds, cross-references them against your own findings, tracks leaked credentials and monitored assets, and rolls everything up into a single risk score. It is the view you open to answer "how exposed is this workspace right now, and what should we act on first?"

Open it from the top navigation as **Cyber Threat Intelligence** (route `/threat`). The page description reads "OTX AlienVault, leaked credentials, manual indicators & unified risk score."

## Who can use it

- Anyone signed in to a workspace can open CTI and read it.
- Triage actions (changing the status of news or leaked-credential rows, bulk status changes, deletes, adding or removing monitored indicators) need the scan-results-modify permission. Without it you see these sections read-only.

Everything is scoped to the workspace you pick in the header switcher. If a workspace has no targets yet, the page asks you to create one first.

## Refresh the intelligence

Use the workspace switcher below the header to scope the page. A status badge shows the last refresh state, including a live percentage while a refresh runs. Click **Refresh** to pull fresh intelligence, and **Generate report** to open the threat-intel report in a new tab (see [Reports](/user/06-reports/)).

When a feed has no live data yet, the page says so and keeps working with whatever it has.

## The unified risk score

At the top sits the **Unified risk score** gauge, a single number from 0 to 100 for the workspace. It brings your VA findings, leaked credentials, exposure findings, and threat intelligence together into one posture number. The score is color banded: green for low, yellow for the middle range, and red for high. Reviewing and resolving findings and leaks lowers the score, so the gauge rewards triage.

Next to the gauge, a stat row shows **OTX pulses**, **Malware refs**, **Leaked creds** (with how many are still unchecked), and **Indicators**.

## Threat landscape feeds

Two cards give you the outside-in view:

- **Ransomware landscape**: current ransomware activity with victim and group counts, an Indonesia-highlighted globe of victims by country, the top active groups, and a recently-disclosed victims feed you can filter by country and sector.
- **Known exploited (CISA KEV)**: the CISA Known Exploited Vulnerabilities catalog cross-referenced against your workspace. The **Your findings in KEV** section flags findings whose CVEs are actively exploited in the wild, each with an EPSS exploit-probability percentage, so you can prioritize them. When none of your findings match, the card instead shows the latest additions to the KEV catalog as general threat intel.

The EPSS and KEV labels tell you two different things: KEV means a CVE is confirmed to be exploited in the wild right now, and the EPSS percentage is the probability that a CVE will be exploited. Lead with the KEV matches, then use EPSS to order the rest.

## News and narrative

- **Brand news**: headlines about your workspace brand, with optional per-headline AI sentiment and relevance.
- **AI risk analysis**: a written narrative of the workspace's risk picture that you can generate or regenerate.
- **Security news**: the latest security headlines for the workspace sector. With the right permission you can set the sector, bulk-review headlines, and trigger triage.

## Passive exposure and leaked credentials

- **Exposure (passive)**: a summary of the exposure findings discovered on the Attack Surface page, with a link to open them there. Credential-class findings here overlap with the leaked credentials below and contribute to the risk score.
- **Leaked credentials**: a searchable, triable table of credentials tied to the workspace, with passwords masked until you reveal them. With the scan-results-modify permission you can change a row's status or run a bulk status change. When the source reports more results than it can return, the page tells you the list is truncated and to treat the count as a floor.

This workspace-scoped leaked-credentials table is distinct from the standalone [Leaks](/products/04-leaks/) search tool, which runs ad hoc searches on any term.

## Monitored assets

The **Monitored assets (manual indicators)** section lets you track your own public IPs, domains, and subdomains. Add them one per line, and each is checked against VirusTotal engines and OTX pulses on every refresh. A flagged asset usually means compromise, blacklisting, or abuse of your infrastructure. Each indicator shows a verdict badge, when it was last checked, and the VirusTotal and OTX counts behind the verdict.
