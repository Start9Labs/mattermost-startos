import { T } from '@start9labs/start-sdk'
import { CALLS_PLUGIN_ID, configJson } from './fileModels/config.json'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  buildDataSource,
  chownCommand,
  getChownSub,
  getMattermostSub,
  getPostgresSub,
  MM_LOCAL_SOCKET,
  postgresDb,
  postgresUser,
  resolveCallsTurn,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Mattermost!'))

  const store = await storeJson.read().const(effects)
  if (!store) {
    throw new Error(i18n('store.json not found'))
  }
  const { postgresPassword = '', siteUrl, smtp, signup, callsTurn } = store

  // Point the Calls plugin at Coturn, or clear what we put there. Resolves to
  // null when relaying is off, when Coturn has no public domain yet, or when
  // its secret can't be read — in each of those a stale ICE server list would
  // be worse than none, so it is removed rather than left behind.
  const turn = callsTurn ? await resolveCallsTurn(effects) : null
  // Mattermost writes config.json on its own first start. Until it exists there
  // is nothing to merge into, and creating a partial one here would race that
  // entrypoint — so skip, and apply on the next start instead.
  const config = await configJson.read().once()
  const calls = config?.PluginSettings?.Plugins?.[CALLS_PLUGIN_ID]
  // With nothing wanted and nothing of ours present, don't write at all: a
  // Mattermost that never turned relaying on gets no settings entry for a
  // plugin it may not even have installed.
  const present =
    calls?.ICEServersConfigs != null || calls?.TURNStaticAuthSecret != null
  if (config && (turn || present)) {
    await configJson.merge(effects, {
      PluginSettings: {
        Plugins: {
          [CALLS_PLUGIN_ID]: {
            ICEServersConfigs: turn
              ? JSON.stringify(turn.iceServers)
              : undefined,
            TURNStaticAuthSecret: turn?.secret,
          },
        },
      },
    })
  }

  let smtpCredentials: T.SmtpValue | null = null
  if (smtp.selection === 'system') {
    smtpCredentials = await sdk.getSystemSmtp(effects).const()
    const customFrom = smtp.value.customFrom as string | undefined
    if (smtpCredentials && customFrom) smtpCredentials.from = customFrom
  } else if (smtp.selection === 'custom') {
    const { host, from, username, password, security } =
      smtp.value.provider.value
    smtpCredentials = {
      host,
      from,
      username,
      password: password ?? null,
      port: Number(security.value.port),
      security: security.selection,
    }
  }

  const smtpEnv: Record<string, string> = {}
  if (smtpCredentials) {
    smtpEnv.MM_EMAILSETTINGS_SENDEMAILNOTIFICATIONS = 'true'
    smtpEnv.MM_EMAILSETTINGS_ENABLESMTPAUTH = smtpCredentials.username
      ? 'true'
      : 'false'
    smtpEnv.MM_EMAILSETTINGS_SMTPSERVER = smtpCredentials.host
    smtpEnv.MM_EMAILSETTINGS_SMTPPORT = String(smtpCredentials.port)
    smtpEnv.MM_EMAILSETTINGS_SMTPUSERNAME = smtpCredentials.username ?? ''
    smtpEnv.MM_EMAILSETTINGS_SMTPPASSWORD = smtpCredentials.password ?? ''
    smtpEnv.MM_EMAILSETTINGS_FEEDBACKEMAIL = smtpCredentials.from
    smtpEnv.MM_EMAILSETTINGS_FEEDBACKNAME = 'Mattermost'
    smtpEnv.MM_EMAILSETTINGS_CONNECTIONSECURITY =
      smtpCredentials.security === 'tls' ? 'TLS' : 'STARTTLS'
  }

  const siteUrlEnv: Record<string, string> = siteUrl
    ? { MM_SERVICESETTINGS_SITEURL: siteUrl }
    : {}

  const chownSub = getChownSub(effects)
  const postgresSub = getPostgresSub(effects)
  const mattermostSub = getMattermostSub(effects)

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: chownSub,
      exec: { command: chownCommand },
      requires: [],
    })
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: postgresPassword,
          POSTGRES_DB: postgresDb,
        },
      },
      ready: {
        display: i18n('Database'),
        fn: async () => {
          const { exitCode } = await postgresSub.exec([
            'pg_isready',
            '-U',
            postgresUser,
            '-d',
            postgresDb,
            '-h',
            '127.0.0.1',
          ])

          if (exitCode !== 0) {
            return {
              result: 'loading',
              message: i18n('Waiting for PostgreSQL to be ready'),
            }
          }
          return {
            result: 'success',
            message: i18n('PostgreSQL is ready'),
          }
        },
      },
      requires: ['chown'],
    })
    .addDaemon('mattermost', {
      subcontainer: mattermostSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          MM_SQLSETTINGS_DRIVERNAME: 'postgres',
          MM_SQLSETTINGS_DATASOURCE: buildDataSource(postgresPassword),
          MM_SERVICESETTINGS_LISTENADDRESS: `:${uiPort}`,
          MM_PLUGINSETTINGS_ENABLEUPLOADS: 'true',
          MM_SERVICESETTINGS_ENABLELOCALMODE: 'true',
          MM_SERVICESETTINGS_LOCALMODESOCKETLOCATION: MM_LOCAL_SOCKET,
          MM_LOGSETTINGS_ENABLEDIAGNOSTICS: 'false',
          MM_TEAMSETTINGS_ENABLEUSERCREATION: String(signup.enableUserCreation),
          MM_TEAMSETTINGS_ENABLEOPENSERVER: String(signup.enableOpenServer),
          ...siteUrlEnv,
          ...smtpEnv,
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 120000,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('Mattermost is ready'),
            errorMessage: i18n('Mattermost is not ready'),
          }),
      },
      requires: ['postgres'],
    })
})
