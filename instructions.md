# Mattermost

## Documentation

- [Mattermost User's Guide](https://docs.mattermost.com/guides/use-mattermost.html) — chatting, channels, teams, search, and the desktop / mobile apps.
- [Mattermost Administrator's Guide](https://docs.mattermost.com/guides/administration.html) — the System Console, integrations, plugins, and configuration reference.

## What you get on StartOS

- A Mattermost server with its own bundled PostgreSQL database — no other StartOS service is required.
- A **Web UI** interface served on Mattermost's default HTTP port (`8065`). LAN, `.local`, Tor, and any custom domains you've added all work out of the box.
- All of Mattermost's data — uploads, plugins, server config, logs, and the Postgres database — included in StartOS backups and restored together.

## Getting set up

1. Open Mattermost's **Dashboard** and click the **Web UI** interface to open the login page.
2. The first time you visit, Mattermost will prompt you to **create an account**. This account automatically becomes the System Admin — choose a strong password and treat it like one.
3. Mattermost will walk you through creating your first **team** and inviting the first members. Invite links work on any of Mattermost's URLs (LAN, `.local`, Tor, or a custom domain).
4. If you plan to use Mattermost over a public address or a custom domain, open the **System Console → Environment → Web Server** and set the **Site URL** to that exact hostname. Mattermost embeds it in invite links, password-reset emails, and push notifications.
5. Optional but recommended: in the System Console, configure **SMTP** so users can receive invite, mention, and password-reset emails, and **Push Notification Server** if you want mobile push.

## Using Mattermost

### Web interface

The Web UI is the full Mattermost experience: chat, channels, direct messages, file sharing, search, slash commands, and the System Console for admins. The official desktop and mobile apps can also point at any of the same URLs StartOS exposes.

### Plugins

The System Console's **Plugin Management** page lets you upload and enable Mattermost plugins. Uploaded server plugins live under the `plugins` subpath of the `mattermost` volume; their client bundles under `client-plugins`. Both are included in StartOS backups.

### Editing config.json directly

Most settings are reachable through the System Console, but if you ever need to edit `config.json` by hand, it lives on the `mattermost` volume under the `config` subpath. Restart Mattermost from the StartOS Dashboard after editing.
