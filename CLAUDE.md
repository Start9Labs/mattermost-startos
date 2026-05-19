# CLAUDE.md

See [CONTRIBUTING.md](CONTRIBUTING.md) for the doc map and contribution workflow.

## How the upstream version is pulled

- Image `mattermost` is `dockerTag: mattermost/mattermost-team-edition:<version>` in `startos/manifest/index.ts`.
- Bump the tag to upgrade. Available tags: <https://hub.docker.com/r/mattermost/mattermost-team-edition/tags>.

## Operating rules

- The Mattermost image is **distroless** — it has no shell, no `chown`, and no general-purpose binaries. Any volume preparation (creating subdirectories, fixing ownership) has to be done from a different image. This package uses the `postgres` image for the `chown` oneshot.
- The image runs as `mattermost` user (UID/GID `2000:2000`). All `mattermost` volume subpaths must be chowned to `2000:2000` before the daemon starts, or Mattermost crashes attempting to write `config.json` / search indexes.
- PostgreSQL runs co-located on `127.0.0.1:5432` inside the package's network namespace. The password is generated on install and written to `store.json` on the `main` volume; the connection string is assembled in `utils.ts` (`buildDataSource`).
- Mattermost reads its config from `config/config.json` on the `mattermost` volume. StartOS only sets the four `MM_*` env vars listed in the README — everything else is set through the in-app System Console.
