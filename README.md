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

Two models: this package's own state, and a two-key window onto Mattermost's config file.

| File                 | Format | Modelled                | Written by                                     |
| -------------------- | ------ | ----------------------- | ---------------------------------------------- |
| `store.json`         | JSON   | Yes — `FileHelper.json` | Install, every init, and the actions           |
| `config/config.json` | JSON   | Two keys only           | Every start, only while relaying is configured |

| Key                | Set by                                | Notes                                                      |
| ------------------ | ------------------------------------- | ---------------------------------------------------------- |
| `postgresPassword` | Install                               | The bundled database's password; also used to take backups |
| `siteUrl`          | Init, then the Set Primary URL action | The address Mattermost builds links from                   |
| `smtp`             | The Configure SMTP action             | StartOS's system SMTP, your own server, or disabled        |
| `signup`           | The Configure Signups action          | Two toggles, both defaulted below                          |
| `callsTurn`        | The Configure Call Relay action       | Whether the Calls plugin relays through Coturn             |

`siteUrl` is handled by init in two ways. With nothing stored, it picks the `.local` address. With something stored that is **no longer** published, it does not silently replace it — it raises a `critical` task, because that address is embedded in links Mattermost has already sent.

**`config.json` is Mattermost's own file, and the model is a two-key window onto it.** The only keys modelled are `ICEServersConfigs` and `TURNStaticAuthSecret` under the Calls plugin's `com.mattermost.calls` entry; everything else in the file — the whole of Mattermost's configuration and every other plugin's settings — passes through untouched, because the SDK's `z.object` preserves unknown keys at every level and `merge` writes only the keys it is handed. It is written on start **only** when there is something to write or something of ours to clear, so a server that never turned relaying on never gets an entry for a plugin it may not have installed. Turning relaying off removes both keys but leaves the now-empty `com.mattermost.calls` object behind — `merge` created the path and only the keys it was given are removed. Harmless, and Mattermost reads it as no settings at all. Mattermost writes this file itself on its first start; until it exists the package skips the merge rather than racing the image's entrypoint with a partial file.

**Everything else is configured by environment**, and that is where this package's overrides live:

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

One, optional, and only while it is selected. PostgreSQL is bundled as a private sidecar rather than declared as a dependency, so it is not shared with any other service.

| Dependency | Kind      | Health checks | Required                                               |
| ---------- | --------- | ------------- | ------------------------------------------------------ |
| `coturn`   | `running` | **none**      | Only while call relaying is on in Configure Call Relay |

**No health check is declared, deliberately.** Coturn's own `TURN Server` check fails until you attach a public domain to it, and naming it here would leave Mattermost showing a permanently unmet dependency even though Calls works fine without a relay. Coturn's own check already says what is missing.

The shared secret is read through a throwaway `coturn-secret-read` container that mounts only Coturn's `shared` subpath read-only — so a missing or broken Coturn can never take Mattermost's own daemons down, and the rest of Coturn's volume stays out of view.

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

### Configure Call Relay

One toggle: whether Mattermost Calls relays through the Coturn service.

- **What it changes:** `callsTurn` in `store.json`; through it the package's Coturn dependency, and the Calls plugin's `ICEServersConfigs` and `TURNStaticAuthSecret` in `config.json`, which every start reconciles.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent — the settings are derived from Coturn's published addresses and rewritten from scratch each start.

**Coturn authenticates with the TURN REST API shared-secret scheme, which is what makes this work.** It runs `use-auth-secret` with no long-term accounts, so no username or password can be written into the ICE server list; the plugin is handed the shared secret in `TURNStaticAuthSecret` and mints a short-lived credential pair per `turn:` URL itself. The ICE server entry therefore carries only `urls` — the `stun:` and `turn:` addresses on Coturn's plain port, plus `turns:` on the edge-terminated TLS port.

**Relaying is configured only once Coturn has a public domain.** With the toggle on but Coturn lacking one — or with its secret unreadable — the settings are _cleared_ rather than left behind, since an ICE server list pointing at an unreachable relay is worse than none. Nothing reports that as an error; Calls falls back to direct connections.

**While the toggle is on, this package owns Calls' ICE Servers Configurations field** and rewrites it on every start, so a value typed into the System Console will not survive. To point Calls at a different TURN server, leave the toggle off and configure it there instead.

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
7. **The Calls plugin is not shipped and there is no marketplace here.** Call relaying configures a plugin you install yourself, by uploading its release bundle under Plugin Management; the settings are written whether or not it is present, and take effect once it is.
8. **Call relaying is Coturn or nothing.** There is no field for an external TURN server — configure one in the System Console instead, and leave the toggle off.

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
  - coturn-secret-read # temporary; reads Coturn's shared secret
volumes:
  mattermost: six subpaths under /mattermost (data, config, logs, plugins, client-plugins, run)
  db: /var/lib/postgresql (in postgres-sub)
  main: host side (store.json)
file_models:
  - store.json
  - /mattermost/config/config.json # two Calls plugin keys only; the rest passes through
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
dependencies:
  - coturn # optional, running, no health checks; only while call relaying is on
interfaces:
  ui: { type: ui, port: 8065 }
actions:
  - set-primary-url
  - manage-smtp
  - manage-signup
  - manage-calls-turn
  - reset-user-password # only-running
  - promote-to-admin # only-running
  - demote-from-admin # only-running
tasks:
  - { action: set-primary-url, severity: critical }
health_checks:
  - postgres # displayed "Database"
  - mattermost # displayed "Web Interface"
```
