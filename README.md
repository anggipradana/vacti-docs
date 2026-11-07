# Vacti documentation

Vacti is an AI-driven autonomous penetration-testing platform. This repository is the source of
**docs.vacti.org**, the public documentation site — written for the people who buy, evaluate,
deploy and operate Vacti: security leads, IT administrators, procurement and compliance reviewers,
and the engineers who run the appliance.

If you are trying to decide whether Vacti fits your team, start with
[What is Vacti](src/content/docs/start/01-what-is-vacti.md). If you have already decided and need
to get one running, start with [Choose how to install](src/content/docs/start/02-choose-install.md).

## What is documented here

| Section | Who it is for | What it answers |
|---|---|---|
| **Start** | everyone | What Vacti is, and which installation form fits your environment |
| **Install** | administrators | Running the Docker image, the appliance images, or the installer |
| **User guide** | analysts | Day-to-day use: engagements, scans, findings, reporting |
| **Products** | evaluators | What each capability does and when to use it |
| **Administration** | administrators | Users, access, engine management, retention |
| **Architecture** | technical evaluators | The three parts of the system and how a job flows between them |

## Running the site locally

The site is built with [Astro Starlight](https://starlight.astro.build/). Content lives as Markdown
under `src/content/docs/`.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site into ./dist
```

Every push to `main` deploys through `.github/workflows/deploy.yml`.

## Contributing a correction

Documentation fixes are welcome as pull requests. Keep the reader in mind: lead with what the
feature is for, then how to use it. Internal implementation detail does not belong on this site.

## Contact

Product site: [vacti.org](https://vacti.org)

Only ever test systems you are authorised to test.
