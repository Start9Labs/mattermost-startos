import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// The Calls plugin's id. Mattermost keeps a plugin's settings in config.json
// whether or not that plugin is loaded, so these can be written before Calls is
// uploaded and take effect once it is.
export const CALLS_PLUGIN_ID = 'com.mattermost.calls'

// Only the two Calls settings this package owns are modelled. Everything else
// in config.json — the whole of Mattermost's own configuration, and every other
// plugin's settings — is preserved untouched, since the SDK's `z.object` is
// loose at every level and `merge` only writes the keys it is given.
const callsSettings = z.object({
  // A JSON array of ICE server configurations, held as a string; the plugin
  // parses it itself.
  ICEServersConfigs: z.string().optional().catch(undefined),
  // Coturn's `static-auth-secret`. Given this, the plugin mints the short-lived
  // username/credential pair for each `turn:` URL above rather than taking one
  // from the config, which is what makes the REST-API scheme work here.
  TURNStaticAuthSecret: z.string().optional().catch(undefined),
})

const shape = z.object({
  PluginSettings: z
    .object({
      Plugins: z
        .object({
          [CALLS_PLUGIN_ID]: callsSettings.optional().catch(undefined),
        })
        .optional()
        .catch(undefined),
    })
    .optional()
    .catch(undefined),
})

export const configJson = FileHelper.json(
  { base: sdk.volumes.mattermost, subpath: './config/config.json' },
  shape,
)
