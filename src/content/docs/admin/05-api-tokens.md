---
title: API tokens
description: Create and revoke Bearer tokens for the Vacti REST API.
sidebar:
  order: 5
---

Every action in Vacti is scriptable through a typed REST API, authenticated with
a Bearer token. Settings > API tokens (API token) is where a Super Admin mints
and revokes those tokens.

## Who can open it

Super Admin only (requires Modify system config). API tokens authenticate to the
API, including engine enrollment, so the page and both server actions are
restricted to the highest tier. A non-admin is redirected to the dashboard.

## Create a token

1. Open Settings > API tokens.
2. In the create card, type a **Label** (for example `ci-automation`). A blank
   label defaults to `token`.
3. Click **Create token** (Buat token).
4. A panel appears with the heading "Copy now - shown once" (Salin sekarang -
   hanya ditampilkan sekali) and the token in a monospace box.
5. Click the copy icon. A toast confirms "Token copied to clipboard."

Copy the token immediately. Vacti stores only a hash, so the plaintext is shown
exactly once and can never be re-displayed. If you lose it, revoke the token and
create a new one.

The mint records a `token.create` audit entry with the label only. The plaintext
and hash are never written to the audit log.

## Use a token

Send the token as a Bearer credential on API requests. The in-app reference card
links to:

- the interactive API docs at `/api/docs` (Redoc);
- the machine-readable schema at `/api/openapi.json`.

A usage guide lives at `docs/tutorials/getting-started.md` in the repository.

## Revoke a token

The token table lists each token's label and creation date. Click **Revoke**
(Cabut) on a row and confirm. The dialog warns "Any client using it will stop
working." Revocation is immediate and records a `token.revoke` audit entry. You
can only revoke your own tokens.

## Engine enrollment is separate

A plain API token created here authenticates a caller to the API. Enrolling a new
pentest engine into the fleet is a distinct, higher-stakes operation, because a
minted enrollment token registers a new engine that can claim engagements and
receive decrypted target credentials.

Engine enrollment lives under **Settings > Engine and credentials** and is Super
Admin only. The fleet view there is visible to any user who can initiate scans,
but the enrollment (minting) controls appear only for a Super Admin; everyone
else sees a contact-administrator card. A narrow capability token (one that
carries a scope or is bound to an engine) can never mint a new engine, whoever
owns it.

This means a registration code, an API token, and an engine enrollment token are
three different things:

- a **registration code** lets a human self-register a web account;
- an **API token** authenticates a script or client to the REST API;
- an **engine enrollment token** registers a pentest engine into the fleet.

See [Mint registration codes](/admin/02-mint-registration-codes/) for the first
and the Engine and credentials page for the third.
