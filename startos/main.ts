import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  buildDataSource,
  chownCommand,
  getChownSub,
  getMattermostSub,
  getPostgresSub,
  postgresDb,
  postgresUser,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Mattermost!'))

  const postgresPassword =
    (await storeJson.read((s) => s.postgresPassword).const(effects)) ?? ''

  const chownSub = await getChownSub(effects)
  const postgresSub = await getPostgresSub(effects)
  const mattermostSub = await getMattermostSub(effects)

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
