import { storeJson } from './fileModels/store.json'
import { coturnDescription } from './manifest/i18n'
import { sdk } from './sdk'
import { coturnId, coturnVersionRange } from './utils'

// Only while the user has asked Calls to relay through it. No healthChecks:
// Coturn's own `TURN Server` check fails until a public domain is attached to
// it, which would surface here as a permanently unmet dependency even though
// Calls falls back to direct connections. Coturn's own check already names
// what's missing.
const coturn = sdk.Dependency.optional(coturnId, {
  description: coturnDescription,
  metadata: {
    title: 'Coturn',
    icon: 'https://raw.githubusercontent.com/Start9Labs/coturn-startos/d67ecaca5800a87e3300ce44c62484888f35d51b/icon.svg',
  },
  versionRange: coturnVersionRange,
  kind: 'running',
  healthChecks: [],
  enabled: async ({ effects }) =>
    (await storeJson.read((s) => s.callsTurn).const(effects)) ?? false,
})

export const dependencies = sdk.Dependencies.of().addDependency(coturn)
