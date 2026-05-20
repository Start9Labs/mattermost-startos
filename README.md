<p align="center">
  <img src="icon.png" alt="Mattermost Logo" width="21%">
</p>

# Mattermost on StartOS

> **Upstream docs:** <https://docs.mattermost.com/>
>
> Everything not listed in this document should behave the same as upstream
> Mattermost. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Mattermost](https://github.com/mattermost/mattermost) is a self-hosted, open source messaging and collaboration platform — a Slack-style chat workspace for teams. This package wraps the upstream `mattermost-team-edition` container image and ships it as a single-click install on StartOS, alongside a co-located PostgreSQL sidecar.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                            |
| ------------- | ---------------------------------------------------------------- |
| Mattermost    | `mattermost/mattermost-team-edition` (upstream, unmodified)      |
| Database      | `postgres:16-alpine` (upstream, unmodified)                      |
| Architectures | x86_64 (upstream `mattermost-team-edition` does not publish arm64) |
| Entrypoint    | Image default (`/mattermost/bin/mattermost`); PostgreSQL bound to `127.0.0.1` |
| Run as        | UID/GID `2000:2000` (the image's `mattermost` user)              |

A short `chown` oneshot runs before PostgreSQL on every start to (re)create the `data`, `config`, `logs`, `plugins`, `client-plugins`, and `run` subdirectories of the `mattermost` volume and align ownership to `2000:2000`, since the Mattermost image is distroless and cannot perform that itself.

---

## Volume and Data Layout

| Volume       | Subpath          | Mount point                  | Purpose                                                                       |
| ------------ | ---------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `main`       | `store.json`     | (host file)                  | StartOS package state (Postgres password, Site URL, SMTP creds, signup flags) |
| `mattermost` | `data`           | `/mattermost/data`           | File uploads, search indexes, attachments                                     |
| `mattermost` | `config`         | `/mattermost/config`         | `config.json` and other Mattermost runtime config                             |
| `mattermost` | `logs`           | `/mattermost/logs`           | Mattermost server logs                                                        |
| `mattermost` | `plugins`        | `/mattermost/plugins`        | Server-side plugin install directory                                          |
| `mattermost` | `client-plugins` | `/mattermost/client/plugins` | Client-side (webapp) plugin bundle directory                                  |
| `mattermost` | `run`            | `/mattermost/run`            | Local-mode Unix socket so StartOS actions can call `mmctl --local`            |
| `db`         | (root)           | `/var/lib/postgresql`        | PostgreSQL data directory                                                     |

---

## Installation and First-Run Flow

1. On install, StartOS generates a 24-character random PostgreSQL password and stores it in `store.json` on the `main` volume.
2. On every start, a `chown` oneshot prepares the `mattermost` volume's subdirectories.
3. PostgreSQL starts next; the `mmuser` / `mattermost` role and database are created on first run from `POSTGRES_*` env vars.
4. The Mattermost daemon starts last, applies any database migrations, and listens on `:8065`.
5. The first user to register through the web UI becomes the System Admin (Mattermost's default behavior).

No setup wizard is skipped or pre-filled — the only first-run actions are creating a team and an admin account in the web UI.

---

## Configuration Management

| StartOS-managed env var                       | Source                                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `MM_SQLSETTINGS_DRIVERNAME`                   | Forced to `postgres`                                                                                |
| `MM_SQLSETTINGS_DATASOURCE`                   | Points at the local Postgres sidecar                                                                |
| `MM_SERVICESETTINGS_LISTENADDRESS`            | Forced to `:8065`                                                                                   |
| `MM_PLUGINSETTINGS_ENABLEUPLOADS`             | Forced to `true` so the System Console plugin uploader works                                        |
| `MM_SERVICESETTINGS_ENABLELOCALMODE`          | Forced to `true` so StartOS actions can drive `mmctl --local`                                       |
| `MM_SERVICESETTINGS_LOCALMODESOCKETLOCATION`  | Forced to `/mattermost/run/mattermost_local.socket` (shared with action sidecars)                   |
| `MM_LOGSETTINGS_ENABLEDIAGNOSTICS`            | Forced to `false` (telemetry off by default)                                                        |
| `MM_SERVICESETTINGS_SITEURL`                  | "Set Primary URL" action                                                                            |
| `MM_EMAILSETTINGS_*` (SMTP family)            | "Configure SMTP" action                                                                             |
| `MM_TEAMSETTINGS_ENABLEUSERCREATION`          | "Configure Signups" action                                                                          |
| `MM_TEAMSETTINGS_ENABLEOPENSERVER`            | "Configure Signups" action                                                                          |

Anything not listed here (channels, teams, integrations, custom branding, plugins, push notification server, etc.) is set through the System Console in Mattermost itself, or by editing `config.json` directly on the `mattermost` volume.

Env vars set by StartOS lock the corresponding field in the System Console — Mattermost intentionally shows them read-only with a "set via env var" indicator. To change one, use the matching StartOS action.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                  |
| --------- | ---- | -------- | ------------------------ |
| Web UI    | 8065 | HTTP     | Mattermost web interface |

Upstream Mattermost also defines ports `8067`, `8074` and `8075` for metrics / cluster gossip / job server traffic. Those are not exposed by this package — they are only meaningful in a multi-node enterprise deployment.

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

Use the **Set Primary URL** action to pick which of these is the Site URL Mattermost embeds in emails, OAuth callbacks, push notifications, and mobile deep links.

---

## Actions (StartOS UI)

| Action                       | Group    | Effect                                                                                                                 |
| ---------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Set Primary URL              | —        | Sets `MM_SERVICESETTINGS_SITEURL` from the bound interface's available hostnames. Restart picks up the change.         |
| Configure SMTP               | —        | Sets the `MM_EMAILSETTINGS_*` family so password resets, invitations, and mention notifications go out.                |
| Configure Signups            | —        | Toggles `MM_TEAMSETTINGS_ENABLEUSERCREATION` and `MM_TEAMSETTINGS_ENABLEOPENSERVER`.                                   |
| Reset User Password          | Recovery | Runs `mmctl --local user change-password` against the running daemon. Returns a generated password.                    |
| Promote to System Admin      | Recovery | Runs `mmctl --local roles system-admin <user>`.                                                                        |
| Demote from System Admin     | Recovery | Runs `mmctl --local roles member <user>`.                                                                              |

The three Recovery actions require the daemon to be running; they spin up a temporary sidecar that mounts the `mattermost/run` subpath and talks to the daemon's local-mode Unix socket. No login required.

---

## Backups and Restore

**Included in backup:**

- `main` volume (StartOS package state)
- `mattermost` volume (uploads, config, logs, plugins)
- PostgreSQL database (captured with `pg_dump`)

**Restore behavior:** All volumes and the PostgreSQL dump are restored before the service starts; Mattermost replays any migrations against the restored database on first launch.

---

## Health Checks

| Check         | Method                                            | Messages                                                                       |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| Database      | `pg_isready` against the PostgreSQL sidecar       | Loading: "Waiting for PostgreSQL to be ready" / Success: "PostgreSQL is ready" |
| Web Interface | Port listening (`8065`) with a 120 s grace period | Success: "Mattermost is ready" / Error: "Mattermost is not ready"              |

---

## Dependencies

None.

---

## Limitations and Differences

1. **Team Edition only** — this package ships the open source `mattermost-team-edition` image. Enterprise-only features (LDAP/SAML SSO, compliance exports, high availability, etc.) are not available.
2. **Single-node deployment** — there is no cluster gossip, metrics, or job-server port published. Mattermost runs as one process on one StartOS device.
3. **Local PostgreSQL only** — the package is wired to its own bundled PostgreSQL sidecar, listening on `127.0.0.1`. Pointing Mattermost at an external database is not supported.
4. **Distroless image** — the Mattermost container has no shell, so admin operations from inside the container must use `mmctl --local` (the upstream way), not `docker exec sh`.

---

## What Is Unchanged from Upstream

- The Mattermost server binary, all bundled plugins, and the web client are exactly as published in `mattermost/mattermost-team-edition`.
- The default PostgreSQL schema, migrations, and `mmctl` behavior are unchanged.
- All Mattermost System Console settings (apart from those listed under **StartOS-managed** above) behave as documented upstream.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: mattermost
architectures: [x86_64]
volumes:
  main: (StartOS state — store.json)
  mattermost/data: /mattermost/data
  mattermost/config: /mattermost/config
  mattermost/logs: /mattermost/logs
  mattermost/plugins: /mattermost/plugins
  mattermost/client-plugins: /mattermost/client/plugins
  mattermost/run: /mattermost/run  # mmctl --local socket
  db: /var/lib/postgresql
ports:
  ui: 8065
dependencies: none
startos_managed_env_vars:
  - MM_SQLSETTINGS_DRIVERNAME
  - MM_SQLSETTINGS_DATASOURCE
  - MM_SERVICESETTINGS_LISTENADDRESS
  - MM_PLUGINSETTINGS_ENABLEUPLOADS
  - MM_SERVICESETTINGS_ENABLELOCALMODE
  - MM_SERVICESETTINGS_LOCALMODESOCKETLOCATION
  - MM_LOGSETTINGS_ENABLEDIAGNOSTICS
  - MM_SERVICESETTINGS_SITEURL                  # via Set Primary URL action
  - MM_EMAILSETTINGS_*                          # via Configure SMTP action
  - MM_TEAMSETTINGS_ENABLEUSERCREATION          # via Configure Signups action
  - MM_TEAMSETTINGS_ENABLEOPENSERVER            # via Configure Signups action
actions:
  - set-primary-url
  - manage-smtp
  - manage-signup
  - reset-user-password
  - promote-to-admin
  - demote-from-admin
```
