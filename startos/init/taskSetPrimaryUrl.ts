import { setPrimaryUrl } from '../actions/setPrimaryUrl'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getNonLocalUrls } from '../utils'

// A stored siteUrl that has gone away raises the critical task rather than
// being silently replaced -- email links, OAuth callbacks and mobile clients
// all key off it. Only an unset value gets the .local fallback.
export const taskSetPrimaryUrl = sdk.setupOnInit(async (effects) => {
  const availableUrls = await getNonLocalUrls(effects)
  const url = await storeJson.read((s) => s.siteUrl).const(effects)

  if (!url) {
    await storeJson.merge(
      effects,
      { siteUrl: availableUrls.find((u) => u.includes('.local')) ?? '' },
      { allowWriteAfterConst: true },
    )
  } else if (!availableUrls.includes(url)) {
    await sdk.action.createOwnTask(effects, setPrimaryUrl, 'critical', {
      reason: i18n('Primary URL removed. Select a new primary URL.'),
    })
  }
})
