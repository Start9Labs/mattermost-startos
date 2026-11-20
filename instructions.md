# Mattermost

## Documentation

- [Mattermost documentation](https://docs.mattermost.com/) — the upstream user and administrator guides: channels, teams, search, the System Console, integrations, plugins, and configuration.

## What you get on StartOS

- A Mattermost server with its own bundled PostgreSQL database — no other StartOS service is required.
- A **Web UI** interface served on Mattermost's default HTTP port (`8065`). It is reachable at every address StartOS gives it — LAN, `.local`, and any domains you add.
- All of Mattermost's data — uploads, plugins, server config, logs, and the Postgres database — included in StartOS backups and restored together.

## Getting set up

1. Open Mattermost's **Dashboard** and click the **Web UI** interface to open the login page.
2. The first time you visit, Mattermost will prompt you to **create an account**. This account automatically becomes the System Admin — choose a strong password and treat it like one.
3. Mattermost will walk you through creating your first **team** and inviting the first members. Invite links work on any of Mattermost's URLs.
4. Run the **Set Primary URL** action from the StartOS Actions menu to choose which of your addresses Mattermost treats as its Site URL. Mattermost embeds it in invite links, password-reset emails, and push notifications, so set it before sending invites. StartOS's **Open UI** button opens Mattermost at that address.
5. Recommended: run the **Configure SMTP** action so users can receive invite, mention, and password-reset emails.
6. If your members use the Mattermost mobile app, turn on push notifications — they start off. See [Mobile push notifications](#mobile-push-notifications) below.

## Signups: invite-only by default

This package ships **invite-only**: the public "create account" page is closed, so random visitors can't register. The very first visitor still becomes your System Admin, and after that everyone joins through an invite link or email invitation — the recommended posture for a self-hosted server.

Two toggles in the **Configure Signups** action control this:

- **Allow Account Creation** — the master switch for _all_ new accounts. Leave it on; turning it off blocks invitations too, effectively freezing your member list.
- **Public Signups** — off by default. Turn it on only if you want anyone who can reach your URL to self-register without an invite.

## Using Mattermost

### Web interface

The Web UI is the full Mattermost experience: chat, channels, direct messages, file sharing, search, slash commands, and the System Console for admins. The official desktop and mobile apps can also point at any of the same URLs StartOS exposes.

### Plugins

The plugins that come with Mattermost, Calls among them, are listed under **System Console → Plugins → Plugin Management** and the in-app **Marketplace**, where you enable or disable them.

**Uploading a plugin file is off by default.** A plugin runs inside the Mattermost server with full access to its data, so while uploads are on, anyone signed in as a System Admin can run code of their choosing on your server. To install a plugin from a file, run the **Configure Plugin Uploads** action, turn the toggle on, upload the plugin in the System Console, then consider turning the toggle off again. Plugins already installed keep working when uploads are off; you need uploads on again only to install a newer version of one.

The Marketplace lists only the bundled plugins until you turn on **Enable Remote Marketplace** under **System Console → Plugins → Plugin Management**; that lets it browse and install plugins from Mattermost's online Marketplace.

Installed plugins are kept on the `mattermost` volume and included in StartOS backups.

### Mobile push notifications

Push notifications are off until you turn them on. To turn them on, go to **System Console → Environment → Push Notification Server** and choose Mattermost's push notification service. Mattermost then relays each notification through Mattermost's push server and on through Apple or Google to the phone.

Notification text is set under **System Console → Site Configuration → Notifications → Push Notification Contents**. On StartOS it starts at **Generic description with only sender name**: the phone shows who wrote, without the channel name or message text. The push relay still receives the sender's name, device token, and routing metadata, including server, channel, and post identifiers. Choose a fuller option if you want channel names or message text on the lock screen, knowing that it then passes through Mattermost's, and Apple's or Google's, servers.

### What leaves your server

Usage telemetry and crash reporting are off. Security-alert reports to Mattermost, Mattermost's in-product notices and the online Marketplace start off as well, and can each be turned back on in the System Console (**Environment → SMTP → Enable Security Alerts**, **Site Configuration → Notices**, and **Plugins → Plugin Management → Enable Remote Marketplace**).

A few connections remain:

- An admin-requested update check can ask GitHub for Mattermost's latest release. This is separate from Mattermost's security-alert reports; Team Edition does not run the scheduled Enterprise health-dashboard check.
- Calls looks up participants' public addresses through Mattermost's STUN server, unless **Configure Call Relay** points it at Coturn instead.
- Push notifications, once you turn them on, go through Mattermost's push server as described above.
- Link previews fetch the pages people link to in messages.

### Calls that won't connect

Mattermost Calls sends audio and video directly between participants, which fails when someone is behind NAT or a strict firewall — the call rings, then stays silent or drops. The **Configure Call Relay** action gives those calls a relay to fall back on.

Three things have to be in place:

1. **Make sure the Calls plugin is enabled.** It comes installed and enabled; check under **System Console → Plugin Management**.
2. **Install the separate Coturn service** from the StartOS marketplace, start it, and give it a public domain of its own, as its own instructions describe.
3. **Run Configure Call Relay** and turn the toggle on.

Until all three are done, calls still work wherever a direct connection is possible, and nothing reports the missing relay as an error.

StartOS is what tells the Calls plugin where the relay is, so leave **ICE Servers Configurations** and **TURN Static Auth Secret** alone in the System Console — while the toggle is on they are rewritten on every start, and anything typed there is replaced. Turning the toggle off clears both again. If you would rather use a TURN server that isn't Coturn, leave the toggle off and fill those fields in yourself.

### Editing config.json directly

Most settings are reachable through the System Console, but if you ever need to edit `config.json` by hand, it lives on the `mattermost` volume under the `config` subpath. Restart Mattermost from the StartOS Dashboard after editing. The one exception is the two Calls relay settings above: while **Configure Call Relay** is on, StartOS owns them and a hand edit will not survive a restart.
