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
4. Run the **Set Primary URL** action from the StartOS Actions menu to choose which of your addresses Mattermost treats as its Site URL. Mattermost embeds it in invite links, password-reset emails, and push notifications, so set it before sending invites.
5. Recommended: run the **Configure SMTP** action so users can receive invite, mention, and password-reset emails. (Mobile push still goes through Mattermost's **Push Notification Server**, configured in the System Console.)

## Signups: invite-only by default

This package ships **invite-only**: the public "create account" page is closed, so random visitors can't register. The very first visitor still becomes your System Admin, and after that everyone joins through an invite link or email invitation — the recommended posture for a self-hosted server.

Two toggles in the **Configure Signups** action control this:

- **Allow Account Creation** — the master switch for *all* new accounts. Leave it on; turning it off blocks invitations too, effectively freezing your member list.
- **Public Signups** — off by default. Turn it on only if you want anyone who can reach your URL to self-register without an invite.

## Using Mattermost

### Web interface

The Web UI is the full Mattermost experience: chat, channels, direct messages, file sharing, search, slash commands, and the System Console for admins. The official desktop and mobile apps can also point at any of the same URLs StartOS exposes.

### Plugins

The System Console's **Plugin Management** page lets you upload and enable Mattermost plugins. Uploaded server plugins live under the `plugins` subpath of the `mattermost` volume; their client bundles under `client-plugins`. Both are included in StartOS backups.

### Editing config.json directly

Most settings are reachable through the System Console, but if you ever need to edit `config.json` by hand, it lives on the `mattermost` volume under the `config` subpath. Restart Mattermost from the StartOS Dashboard after editing.
