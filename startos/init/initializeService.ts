import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { configJson } from '../fileModels/config.json'
import { storeJson } from '../fileModels/store.json'
import { privacyDefaults } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    const postgresPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 24,
    })

    await storeJson.merge(effects, { postgresPassword })
    // Mattermost fills in every key a partial config.json leaves out on its first start.
    await configJson.merge(effects, privacyDefaults)
  } else {
    await storeJson.merge(effects, {})
  }
})
