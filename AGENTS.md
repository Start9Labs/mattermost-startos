# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **The recovery actions reach Mattermost through the local-mode socket, not the network**, which is why they are `only-running` and why the `run` subpath is mounted into their subcontainers as well as the daemon's. `mmctl` has no flag for the socket path — it reads `MMCTL_LOCAL_SOCKET_PATH`, so that env var is what points it at the shared mount.
- **`MM_SERVICESETTINGS_ENABLELOCALMODE` must stay on.** Without it the recovery actions have no way in, which is precisely the situation they exist for.
- **The `mattermost` volume is mounted as six subpaths, not at its root**, so each directory lands where the image expects it. The `chown` oneshot creates all six and hands them to uid/gid 2000 before anything starts, because StartOS mounts volumes root-owned.
- **`ENABLEUSERCREATION` and `ENABLEOPENSERVER` are different switches.** The first is a master gate that blocks even invitations; the second only controls self-service sign-up. Don't collapse them into one toggle.
- **The database password lives in `store.json` on the `main` volume and is what backups authenticate with.** Moving it breaks `backups.ts` as well as `main`.
- **x86_64 only** — both images are declared for that architecture alone. Adding aarch64 means verifying upstream publishes it for both.
