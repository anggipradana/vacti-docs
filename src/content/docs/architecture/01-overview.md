---
title: Architecture overview
description: The three parts of Vacti - the web control plane, the pentest engine, and the OS images - and how a job flows between them.
sidebar:
  order: 1
---

Vacti has three parts: the web control plane you host, the pentest engine that
runs on an appliance you control, and the downloadable OS images an engine is
built from. This page gives the high-level picture and shows how a job flows
between them. You do not need any of this to use Vacti; it is here for readers
who want the mental model.

## The three parts

### Control plane (web app)

The control plane is the self-hosted web application. It serves the operator UI
and stores your work: engagements, findings, evidence, reports, and the record
of each engine you have enrolled. You deploy it once, on a server you control,
and everything else talks to it.

### Engine (on the appliance)

The engine runs as a background service on an appliance you control. It is an
outbound-only worker: it opens no inbound public port and instead reaches out to
your control plane to pick up jobs, report progress, and write findings and
evidence back. Because it only ever connects outward, an engine can sit behind
NAT or deep inside a target network and still work.

The engine is a thin client of the control plane. The findings it produces and
your reports all live on the control plane, not on the box. Your customer data
never lives only on an engine, and an engine is useless without a live, licensed
control plane to drive it.

### OS images

An engine ships as a downloadable image: a VM appliance (OVA) or a Docker image.
You pick the form that fits your environment,
boot it, and enroll it against your control plane. See
[Choosing how to install](/start/02-choose-install/).

## How a job flows

At a high level, the flow for one engagement is simple:

1. You create an engagement in the control plane and start a run.
2. An engine you have enrolled picks up the work, runs the methodology against the
   target, and captures evidence.
3. The engine sends its findings and evidence back to the control plane.
4. You review the findings and export a report from the control plane.

The engine always reaches out to the control plane over an outbound connection;
the control plane never connects into the engine. That is why an engine can live
behind NAT or deep in a target network and still work.

## How the pieces talk

There are two separate channels, and they run in opposite directions. The data
plane (jobs, findings, evidence) is always started by the engine. The ops channel
(a shell on the box for maintenance) is started by you, the operator.

```
  +-------------------+        sync         +------------+
  | Web control plane | <-----------------> |  Postgres  |
  +-------------------+                      +------------+
          ^
          |  HTTPS long-poll (engine dials out,
          |  pulls jobs, writes findings back)
          |
  +--------------------------------+
  | Engine (on remote appliance)   |
  +--------------------------------+
          ^
          |  Overlay tunnel device auth (operator admin, ops only)
          |
  +-------------------+
  | Operator laptop   |
  +-------------------+
```

A few things to take from this:

- The control plane keeps your work in its own database. You never touch that
  directly; the web app is the only thing that reads and writes it.
- The engine is what moves data between the two. It dials out to the control
  plane over HTTPS and holds a long-poll to pick up jobs and send results back.
  The control plane never opens a connection toward the engine, and it never
  pushes work onto the box. If you use the in-browser terminal, that too rides
  the same engine-started connection, so no inbound port is opened for it.
- Shell access to the appliance is a separate, operator-only path. It is for
  maintenance such as package upgrades and reading logs, not for how Vacti runs
  jobs. It uses your overlay admin tunnel's device identity, so only machines on
  your overlay can reach it. See [Troubleshooting](/architecture/04-troubleshooting/)
  for how to use it.

## Why the engine is a thin client

Because the methodology and the license check both live under the control plane's
authority, disabling an engine there takes it offline: with no jobs and no live
license, a disabled engine goes inert. This is both the security boundary and the
commercial boundary (an engine is useless without a live, licensed control
plane).

## Where to go next

- Get an engine online: [First-boot enrollment](/install-appliance/05-first-boot-enrollment/).
- When something breaks: [Troubleshooting](/architecture/04-troubleshooting/).
