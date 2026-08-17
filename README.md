<p align="center">
  <img src="icon.png" alt="Mattermost Logo" width="21%">
</p>

# Mattermost on StartOS

> Everything not listed in this document should behave the same as upstream
> Mattermost. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Mattermost](https://github.com/mattermost/mattermost) is a team messaging platform. This package bundles the PostgreSQL it needs as a private sidecar, closes public sign-ups by default, and exposes admin recovery through actions rather than a shell.

- **Upstream repo:** <https://github.com/mattermost/mattermost>
- **Wrapper repo:** <https://github.com/Start9Labs/mattermost-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Two upstream images, unmodified.

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| Images        | `mattermost/mattermost-team-edition`, `postgres` |
| Architectures | **x86_64 only**                                  |
| Entrypoint    | Each image's own                                 |

| Subcontainer       | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `mattermost-sub`   | The `mattermost` daemon — the one to `attach` to                 |
| `postgres-sub`     | The private database                                             |
| `mattermost-chown` | A oneshot that prepares directory ownership before either starts |
| `mmctl-*`          | Temporary; one per recovery action, running Mattermost's own CLI |

Postgres listens on loopback only, inside the service's own network namespace.

## Volume and Data Layout

Three volumes, and one of them never enters a container.

| Volume       | Mount Point                             | Purpose                                                                            |
| ------------ | --------------------------------------- | ---------------------------------------------------------------------------------- |
| `mattermost` | six subpaths under `/mattermost`        | Uploads, configuration, logs, server and client plugins, and the local-mode socket |
| `db`         | `/var/lib/postgresql` in `postgres-sub` | The PostgreSQL data directory                                                      |
| `main`       | — (host side)                           | `store.json`; never mounted into a container                                       |

The `mattermost` volume is mounted **as six separate subpaths** rather than at its root, so each of Mattermost's directories lands where the image expects it. The `run` subpath is the important one: it holds the local-mode socket, and it is mounted into the recovery actions' subcontainers too — that shared socket is how they reach the running server.

The `chown` oneshot creates all six and hands them to the image's user before anything starts, since StartOS mounts volumes root-owned.

## File Models

One model, holding what upstream would ask for in its config file or setup wizard.

| File         | Format | Modelled                | Written by                           |
| ------------ | ------ | ----------------------- | ------------------------------------ |
| `store.json` | JSON   | Yes — `FileHelper.json` | Install, every init, and the actions |

| Key                | Set by                                | Notes                                                      |
| ------------------ | ------------------------------------- | ---------------------------------------------------------- |
| `postgresPassword` | Install                               | The bundled database's password; also used to take backups |
| `siteUrl`          | Init, then the Set Primary URL action | The address Mattermost builds links from                   |
| `smtp`             | The Configure SMTP action             | StartOS's system SMTP, your own server, or disabled        |
| `signup`           | The Configure Signups action          | Two toggles, both defaulted below                          |

`siteUrl` is handled by init in two ways. With nothing stored, it picks the `.local` address. With something stored that is **no longer** published, it does not silently replace it — it raises a `critical` task, because that address is embedded in links Mattermost has already sent.

**No configuration file reaches the application.** Mattermost is configured entirely by environment, and that is where this package's overrides live:

| Variable                                               | Value              | Why it differs from leaving Mattermost alone                                               |
| ------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------ |
| `MM_TEAMSETTINGS_ENABLEOPENSERVER`                     | `false` at install | A personal server should be invite-only, not self-service                                  |
| `MM_LOGSETTINGS_ENABLEDIAGNOSTICS`                     | `false`            | Nothing phones home                                                                        |
| `MM_SERVICESETTINGS_ENABLELOCALMODE`                   | `true`             | Local mode is what lets the recovery actions administer the server without a network login |
| `MM_PLUGINSETTINGS_ENABLEUPLOADS`                      | `true`             | Plugins can be installed, since the marketplace flow is not available here                 |
| `MM_SQLSETTINGS_*`, `MM_SERVICESETTINGS_LISTENADDRESS` | derived            | Wiring to the bundled database and the published port                                      |
| `MM_EMAILSETTINGS_*`                                   | derived            | Absent unless SMTP is configured                                                           |

`MM_TEAMSETTINGS_ENABLEUSERCREATION` is a second, broader switch, left on by default: turning it off freezes the member list entirely, blocking even invitations.

## Dependencies

None. PostgreSQL is bundled as a private sidecar rather than declared as a dependency, so it is not shared with any other service.

## Network Access and Interfaces

One interface, serving the web client and Mattermost's API — which is also what the mobile and desktop apps use.

| Interface | Id   | Type | Port | Description                  |
| --------- | ---- | ---- | ---- | ---------------------------- |
| Web UI    | `ui` | ui   | 8065 | The Mattermost web interface |

The port is bound on the `ui-multi` MultiHost and is not masked.

## Installation and First-Run Flow

Install generates the database password and picks a site URL from the addresses published for the interface, preferring the `.local` one. No task is raised on a fresh install and no credential is shown: **the first account created in the web UI becomes the System Admin**, regardless of the sign-up settings.

Two things are worth doing before inviting anyone:

- **Set the site URL to the address people will actually use.** Mattermost builds email links, OAuth callbacks, push-notification payloads, and mobile deep links from it, so changing it later leaves already-sent links pointing at the old one.
- **Configure SMTP**, without which invitations and password resets cannot be sent — and without which the only route back into a locked-out account is the recovery actions here.

## Actions

Six actions, in two groups.

### Set Primary URL

Chooses which published address Mattermost treats as its site URL.

- **What it changes:** `siteUrl` in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent, but not consequence-free once in use — links already sent keep the old address, and mobile clients configured against it need updating.
- **Input:** a dropdown of the interface's non-local addresses.

### Configure SMTP

Sets up outbound email for invitations, password resets, and mention notifications.

- **What it changes:** `smtp` in `store.json`; the credentials become Mattermost's email environment on the next start.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent; the form is pre-filled.

### Configure Signups

Two switches: whether accounts can be created at all, and whether sign-up is public.

- **What it changes:** `signup` in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent, and existing accounts are unaffected.
- **The distinction matters.** Public sign-ups off means invite-only — people still join by invitation. Account creation off means nobody new can join at all, including by invitation.

### Recovery — Reset User Password, Promote to System Admin, Demote from System Admin

Three actions grouped under Recovery, each taking a username or email and each **only available while the service is running**, because they reach Mattermost through its local-mode socket rather than over the network.

- **Reset User Password** generates a new password for one account and shows it once. Use it when an admin is locked out and SMTP-based recovery is unavailable.
- **Promote to System Admin** elevates an existing account — the way back in when the original admin has left.
- **Demote from System Admin** reverses that.

None of the three requires being logged in, which is the point: they work when the web interface does not.

## Tasks

One task, and it cannot appear on a fresh install.

| Task            | Severity   | Raised when                                                 | Cleared when    |
| --------------- | ---------- | ----------------------------------------------------------- | --------------- |
| Set Primary URL | `critical` | A site URL was set, and that address is no longer published | The action runs |

Init picks an address when none is stored, so this fires only when one that was in use goes away. `critical` because a wrong site URL breaks email links, mobile clients, and OAuth callbacks in ways that are not obvious from inside the app.

## Health Checks

Two checks, one per daemon.

| Check        | Displayed       | Method                 | Grace |
| ------------ | --------------- | ---------------------- | ----- |
| `postgres`   | "Database"      | `pg_isready`           | —     |
| `mattermost` | "Web Interface" | Port 8065 is listening | 2 min |

**The two-minute grace covers a first start**, where the database is initialised and Mattermost runs its schema migrations before binding. `postgres` reports `loading` rather than failing while it comes up, so a slow first start looks like progress rather than a fault.

A `mattermost` failure after that points at the application — most often a configuration value it rejects, which it names in the service logs.

## Backups and Restore

Mixed, and the distinction decides what a restore gives you.

- **`db` is dumped, not copied.** `Backups.withPgDump` takes a logical dump of the Mattermost database, authenticating with the password from `store.json`. The volume's files are never captured; a restore replays the dump into a fresh database.
- **`mattermost` and `main` are copied wholesale** — uploads, configuration, plugins, and `store.json` with the database password, site URL, and SMTP settings.

The two halves are not independent: the dump is taken with a credential that lives in `store.json`, so a backup missing that file could not be restored.

**Restore is complete** — messages, channels, accounts, and uploaded files all return. If the restored server does not publish the site URL the backup recorded, the task above asks you to choose a new one.

## Limitations and Differences

1. **x86_64 only.** There is no aarch64 or riscv64 build of this package.
2. **PostgreSQL is a private sidecar.** It cannot be shared with another service or replaced with an external database.
3. **Public sign-ups are off at install.** The server is invite-only until you change it; the first account is System Admin regardless.
4. **Telemetry is disabled.**
5. **Local mode is enabled**, which is what makes the recovery actions work without a login. It is reachable only through a socket inside the service.
6. **Changing the site URL restarts the service**, and does not retroactively fix links already sent.

---

## Quick Reference for AI Consumers

```yaml
package_id: mattermost
image: mattermost/mattermost-team-edition # plus postgres
architectures:
  - x86_64
subcontainers:
  - mattermost-sub # the application; the one to attach to
  - postgres-sub # private database
  - mattermost-chown # oneshot; directory ownership
  - mmctl-reset-password # temporary; recovery actions (also -promote, -demote)
volumes:
  mattermost: six subpaths under /mattermost (data, config, logs, plugins, client-plugins, run)
  db: /var/lib/postgresql (in postgres-sub)
  main: host side (store.json)
file_models:
  - store.json
startos_managed_env_vars:
  - MM_SQLSETTINGS_DRIVERNAME
  - MM_SQLSETTINGS_DATASOURCE
  - MM_SERVICESETTINGS_LISTENADDRESS
  - MM_SERVICESETTINGS_ENABLELOCALMODE
  - MM_SERVICESETTINGS_LOCALMODESOCKETLOCATION
  - MM_SERVICESETTINGS_SITEURL
  - MM_PLUGINSETTINGS_ENABLEUPLOADS
  - MM_LOGSETTINGS_ENABLEDIAGNOSTICS
  - MM_TEAMSETTINGS_ENABLEUSERCREATION
  - MM_TEAMSETTINGS_ENABLEOPENSERVER
  - MM_EMAILSETTINGS_SENDEMAILNOTIFICATIONS # when SMTP is configured
  - MM_EMAILSETTINGS_ENABLESMTPAUTH # when SMTP is configured
  - MM_EMAILSETTINGS_SMTPSERVER # when SMTP is configured
  - MM_EMAILSETTINGS_SMTPPORT # when SMTP is configured
  - MM_EMAILSETTINGS_SMTPUSERNAME # when SMTP is configured
  - MM_EMAILSETTINGS_SMTPPASSWORD # when SMTP is configured
  - MM_EMAILSETTINGS_FEEDBACKEMAIL # when SMTP is configured
  - MM_EMAILSETTINGS_FEEDBACKNAME # when SMTP is configured
  - MM_EMAILSETTINGS_CONNECTIONSECURITY # when SMTP is configured
  - POSTGRES_USER # postgres-sub
  - POSTGRES_PASSWORD # postgres-sub
  - POSTGRES_DB # postgres-sub
dependencies: []
interfaces:
  ui: { type: ui, port: 8065 }
actions:
  - set-primary-url
  - manage-smtp
  - manage-signup
  - reset-user-password # only-running
  - promote-to-admin # only-running
  - demote-from-admin # only-running
tasks:
  - { action: set-primary-url, severity: critical }
health_checks:
  - postgres # displayed "Database"
  - mattermost # displayed "Web Interface"
```
