---
title: What is Vacti
description: A plain-language overview of Vacti, its three moving pieces, who uses them, and how they fit together.
sidebar:
  order: 1
---

Vacti is an AI-driven penetration-testing platform. You drive engagements from a
web control plane, and the real testing work runs on a separate appliance called
the engine. This page explains what each piece is, who uses it, and how the
pieces talk to each other, so the rest of the docs make sense.

## The short version

- You log in to a **web control plane** and set up an engagement (scope,
  targets, credentials).
- A **pentest engine** on an appliance you control claims that work, runs the
  methodology, and streams findings and evidence back.
- The engine ships as a set of **operating-system images** (VM, container, and
  bare-metal ISO) so you can run it wherever your testing network lives.

The engine never works alone. It is a thin outbound worker that depends on the
control plane for its jobs and its license. Everything of value (findings,
evidence, reports, customer data) lives server-side on the control plane.

## The three pieces

### 1. The control plane (web app)

The control plane is the web application you operate. It is where a human
creates engagements, watches progress, reviews findings, and exports reports. It
also mints the enrollment tokens that bring new engines online and holds the
license kill-switch that can make any engine inert.

The control plane is a self-contained application you deploy once, on a server
you control. It serves the operator UI and stores all of your work: engagements,
findings, evidence, and reports.

### 2. The pentest engine (appliance)

The engine is the component that actually tests targets. It runs as a background
service on an appliance you own or rent. The engine is an **outbound-only
worker**: it does not listen for inbound connections on a public port. Instead it
reaches out to the control plane to pick up work and send findings and evidence
back.

Because the engine is outbound-only, you can run it deep inside a target
network, behind NAT, or on a jump host, and it still works as long as it can
reach the control-plane URL.

The engine launches browsers for evidence capture and runs the methodology on the
targets it is given. All customer data (findings, evidence, reports) is held
server-side, and an engine is useless without a live, licensed control plane to
drive it.

### 3. The operating-system images

You do not install the engine by hand. Vacti publishes ready-made OS images with
the engine, its dependencies, and the first-boot enrollment flow already baked
in. The images come in several forms so you can match your infrastructure:

- **OVA** for VMware and VirtualBox.
- **qcow2** for KVM and Proxmox.
- **Docker image** for container stacks and quick `docker run` sessions.
- **ISO** for bare-metal installs, in a headless SKU and a GUI SKU.

All forms boot into the same first-boot enrollment flow and run the same engine.
The next page, [Choosing how to install](/start/02-choose-install/), is a
decision guide for picking a form.

## Who uses Vacti

- **Penetration testers** create engagements, launch runs, and review findings
  and evidence in the control plane. They do not manage the factory (tokens,
  releases, the methodology bundle).
- **Administrators** deploy the control plane, bring engines online with
  enrollment tokens, manage releases, and hold the license kill-switch. See the
  [admin docs](/admin/01-admin-overview/) for these tasks.
- **Auditors** read reports.

The split matters because the engine's methodology is the crown jewel. The
control plane gates who can touch it, so a day-to-day tester can run engagements
without ever being able to export the methodology.

## How it fits together

Here is the lifecycle of a single engagement, end to end:

1. An administrator deploys the control plane.
2. The administrator mints a one-time enrollment token in the control plane and
   supplies it to a fresh engine image on first boot.
3. The engine activates against the control plane, comes online, and starts its
   service. See [First-boot enrollment](/install-appliance/05-first-boot-enrollment/)
   for the walkthrough.
4. A tester creates an engagement in the control plane and starts a run.
5. The engine picks up the work, runs the methodology, and sends findings and
   evidence back to the control plane.
6. The tester reviews the findings and exports a report.

At no point does the engine expose an inbound service, and at no point does
customer data live only on the engine. The control plane is always the source of
truth.

## Where to go next

- Picking an image form: [Choosing how to install](/start/02-choose-install/).
- The full component picture: [Architecture overview](/architecture/01-overview/).
- Getting an engine online: [First-boot enrollment](/install-appliance/05-first-boot-enrollment/).
- When something breaks: [Troubleshooting](/architecture/04-troubleshooting/).
