import { T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { coturnId, coturnVersionRange } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const deps: T.CurrentDependenciesResult<any> = {}

  // Only while the user has asked Calls to relay through it. No healthChecks:
  // Coturn's own `TURN Server` check fails until a public domain is attached to
  // it, which would surface here as a permanently unmet dependency even though
  // Calls falls back to direct connections. Coturn's own check already names
  // what's missing.
  if (await storeJson.read((s) => s.callsTurn).const(effects)) {
    deps[coturnId] = {
      kind: 'running',
      versionRange: coturnVersionRange,
      healthChecks: [],
    }
  }
  return deps
})
