# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `mattermost`.** A leaf UI app with no dependents; the only exported interface is the `ui` web interface (host id `ui-multi`, interface id `ui` — both exported from `startos/utils.ts`).
- **Two daemons plus a chown oneshot.** `main.ts` runs `mattermost-sub` (the Mattermost server, image `mattermost`) and `postgres-sub` (a bundled PostgreSQL, image `postgres`), preceded by the `mattermost-chown` oneshot (image `postgres`) that fixes volume ownership to uid/gid 2000. Postgres binds `127.0.0.1`; the server reaches it over loopback.
- **Bundles its own PostgreSQL.** Backups go through `withPgDump` (`startos/backups.ts`); the DB password lives in `store.json`.
- **Admin actions drive `mmctl` over the local-mode socket.** Promote/demote/reset-password spin up a temporary `mattermost`-image subcontainer and run `mmctl --local`, which reads the socket path from `MMCTL_LOCAL_SOCKET_PATH` on the shared `run` mount (`startos/utils.ts`).

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach mattermost -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `mattermost-sub` or `postgres-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
