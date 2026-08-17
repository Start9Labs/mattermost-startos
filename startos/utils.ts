import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'

export const uiPort = 8065
export const postgresPort = 5432
export const postgresUser = 'mmuser'
export const postgresDb = 'mattermost'

// Host id (the `sdk.MultiHost.of` group) vs. the interface id exported on it —
// they differ here, so keep both for `sdk.host.getOwn` lookups.
export const uiHostId = 'ui-multi'
export const uiInterfaceId = 'ui'

export const MM_USER_UID = 2000
export const MM_USER_GID = 2000

export const MATTERMOST_DIR = '/mattermost'
export const POSTGRES_DIR = '/var/lib/postgresql'

export const MM_RUN_DIR = `${MATTERMOST_DIR}/run`
export const MM_LOCAL_SOCKET = `${MM_RUN_DIR}/mattermost_local.socket`

export const mattermostMounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'mattermost',
    subpath: 'data',
    mountpoint: `${MATTERMOST_DIR}/data`,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'mattermost',
    subpath: 'config',
    mountpoint: `${MATTERMOST_DIR}/config`,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'mattermost',
    subpath: 'logs',
    mountpoint: `${MATTERMOST_DIR}/logs`,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'mattermost',
    subpath: 'plugins',
    mountpoint: `${MATTERMOST_DIR}/plugins`,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'mattermost',
    subpath: 'client-plugins',
    mountpoint: `${MATTERMOST_DIR}/client/plugins`,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'mattermost',
    subpath: 'run',
    mountpoint: MM_RUN_DIR,
    readonly: false,
  })

export const mmctlMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'mattermost',
  subpath: 'run',
  mountpoint: MM_RUN_DIR,
  readonly: false,
})

const chownMountpoint = '/mnt/mattermost'

export const chownMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'mattermost',
  subpath: null,
  mountpoint: chownMountpoint,
  readonly: false,
})

export const chownCommand = [
  'sh',
  '-c',
  `mkdir -p ${chownMountpoint}/data ${chownMountpoint}/config ${chownMountpoint}/logs ${chownMountpoint}/plugins ${chownMountpoint}/client-plugins ${chownMountpoint}/run && chown -R ${MM_USER_UID}:${MM_USER_GID} ${chownMountpoint}`,
] as const satisfies [string, ...string[]]

export const postgresMount = sdk.Mounts.of().mountVolume({
  volumeId: 'db',
  subpath: null,
  mountpoint: POSTGRES_DIR,
  readonly: false,
})

export function getMattermostSub(effects: T.Effects) {
  return sdk.SubContainer.of(
    effects,
    { imageId: 'mattermost' },
    mattermostMounts,
    'mattermost-sub',
  )
}

export function getChownSub(effects: T.Effects) {
  return sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    chownMounts,
    'mattermost-chown',
  )
}

export function getPostgresSub(effects: T.Effects) {
  return sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    postgresMount,
    'postgres-sub',
  )
}

export function buildDataSource(password: string): string {
  return `postgres://${postgresUser}:${encodeURIComponent(password)}@127.0.0.1:${postgresPort}/${postgresDb}?sslmode=disable&connect_timeout=10`
}

export async function getNonLocalUrls(effects: T.Effects): Promise<string[]> {
  return sdk.host
    .getOwn(effects, uiHostId, (host) => {
      const iface = Object.values(host?.bindings ?? {})
        .flatMap((b) => Object.values(b.interfaces))
        .find((i) => i.id === uiInterfaceId)
      return iface?.addressInfo.nonLocal.format() || []
    })
    .const()
}

// The external Coturn package the Calls plugin relays through.
export const coturnId = 'coturn'
export const coturnVersionRange = '>=4.14.0:0'
export const coturnHostId = 'turn'
export const coturnInterfaceId = 'turn'
// Coturn publishes its shared secret at `shared/turn-secret` on its `main`
// volume. Mounting that subpath alone keeps the rest of that volume —
// turnserver.conf, which holds the same secret in plaintext, and the coturn
// database — out of view.
export const coturnMountpoint = '/mnt/coturn'
export const coturnSecretPath = `${coturnMountpoint}/turn-secret`

/** One entry of the Calls plugin's `ICEServersConfigs` array. */
type IceServer = { urls: string[] }

/**
 * Coturn's public endpoint as the Calls plugin's ICE server list, plus the
 * shared secret it authenticates with. Coturn's single `turn` interface carries
 * the plain `turn:` address (ssl:false) and the edge-terminated `turns:`
 * address (ssl:true) on one domain, each selected by its `ssl` flag. Null until
 * the user gives Coturn a public domain, or if its secret cannot be read.
 *
 * No username or credential is emitted: with `TURNStaticAuthSecret` set the
 * plugin generates a short-lived pair per `turn:` URL, which is the only scheme
 * Coturn accepts here — it runs `use-auth-secret` with no long-term accounts.
 */
export async function resolveCallsTurn(
  effects: T.Effects,
): Promise<{ iceServers: IceServer[]; secret: string } | null> {
  const endpoint = await sdk.host
    .get(effects, { hostId: coturnHostId, packageId: coturnId }, (host) => {
      const iface =
        host &&
        Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === coturnInterfaceId)
      const hostnames = iface
        ? iface.addressInfo
            .filter({ visibility: 'public', kind: 'domain' })
            .hostnames.filter((h) => h.port != null)
        : []
      const domain = hostnames[0]?.hostname
      if (!domain) return null

      const forDomain = hostnames.filter((h) => h.hostname === domain)
      return {
        domain,
        turnPort: forDomain.find((h) => !h.ssl)?.port ?? null,
        turnsPort: forDomain.find((h) => h.ssl)?.port ?? null,
      }
    })
    .const()
  if (!endpoint) return null

  const secret = await readCoturnSecret(effects)
  if (!secret) return null

  const { domain, turnPort, turnsPort } = endpoint
  const urls = [
    // Reflexive discovery and plain relay both ride the plain listener.
    ...(turnPort
      ? [
          `stun:${domain}:${turnPort}`,
          `turn:${domain}:${turnPort}?transport=udp`,
          `turn:${domain}:${turnPort}?transport=tcp`,
        ]
      : []),
    // Coturn serves TURN over TLS on TCP only.
    ...(turnsPort ? [`turns:${domain}:${turnsPort}?transport=tcp`] : []),
  ]
  return urls.length ? { iceServers: [{ urls }], secret } : null
}

// Read through a throwaway container so a missing Coturn can never break
// Mattermost's own daemons, and we only ever see the `shared` subpath.
async function readCoturnSecret(effects: T.Effects): Promise<string | null> {
  const reader = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountDependency({
      dependencyId: coturnId,
      volumeId: 'main',
      subpath: 'shared',
      mountpoint: coturnMountpoint,
      readonly: true,
    }),
    'coturn-secret-read',
  )
  try {
    const { stdout } = await reader.execFail(['cat', coturnSecretPath])
    return stdout.toString().trim() || null
  } catch {
    return null
  } finally {
    await reader.destroy().catch(() => {})
  }
}

export function mmctlCommand(args: string[]): [string, ...string[]] {
  return ['mmctl', '--local', ...args] as [string, ...string[]]
}

// mmctl has no --local-socket-path flag; it reads the local-mode socket
// location from this env var (default /var/tmp/mattermost_local.socket).
// Point it at the socket on the shared `run` mount so it reaches the daemon.
export const mmctlEnv = { MMCTL_LOCAL_SOCKET_PATH: MM_LOCAL_SOCKET }
