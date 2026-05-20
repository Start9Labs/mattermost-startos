# Updating the upstream version

Mattermost ships with two upstream sources: Mattermost itself (the Team Edition image) and PostgreSQL (the official image used as its database). Both are pulled from Docker Hub and pinned by tag in the same manifest.

## Determining the upstream version

### Mattermost

- Image: [`mattermost/mattermost-team-edition`](https://hub.docker.com/r/mattermost/mattermost-team-edition) on Docker Hub.
- List recent tags:
  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/mattermost/mattermost-team-edition/tags?page_size=20&ordering=last_updated" \
    | jq -r '.results[].name' | grep -Ev '^(latest|release-)'
  ```
- Cross-reference release notes at [Start9Labs's upstream `mattermost/mattermost` releases](https://github.com/mattermost/mattermost/releases) — tag names match the image tags (minus the leading `v`).
- Current pin: `images.mattermost.source.dockerTag` in `startos/manifest/index.ts` (format: `mattermost/mattermost-team-edition:<version>`).

### PostgreSQL

- Image: [`library/postgres`](https://hub.docker.com/_/postgres) on Docker Hub.
- List recent Alpine tags:
  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/library/postgres/tags?page_size=20&ordering=last_updated" \
    | jq -r '.results[].name' | grep -- '-alpine$'
  ```
- Current pin: `images.postgres.source.dockerTag` in `startos/manifest/index.ts` (format: `postgres:<major>-alpine`).
- Bump only when intentionally moving PostgreSQL — keep the major version aligned with what the targeted Mattermost release officially supports. Cross-major upgrades require a database migration, which is **not** handled by this package; coordinate any major bump with a migration plan.

## Applying the bump

In `startos/manifest/index.ts`, update the relevant `dockerTag`:

- Mattermost: `mattermost/mattermost-team-edition:<new version>`
- PostgreSQL: `postgres:<new major>-alpine`
