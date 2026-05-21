import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'

export const uiPort = 8065
export const postgresPort = 5432
export const postgresUser = 'mmuser'
export const postgresDb = 'mattermost'

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

export async function getNonLocalUrls(effects: T.Effects) {
  return sdk.serviceInterface
    .getOwn(effects, 'ui', (i) => i?.addressInfo?.nonLocal.format() || [])
    .const()
}

export function mmctlCommand(args: string[]): [string, ...string[]] {
  return ['mmctl', '--local', ...args] as [string, ...string[]]
}

// mmctl has no --local-socket-path flag; it reads the local-mode socket
// location from this env var (default /var/tmp/mattermost_local.socket).
// Point it at the socket on the shared `run` mount so it reaches the daemon.
export const mmctlEnv = { MMCTL_LOCAL_SOCKET_PATH: MM_LOCAL_SOCKET }
