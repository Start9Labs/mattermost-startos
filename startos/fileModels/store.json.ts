import { FileHelper, smtpShape, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  postgresPassword: z.string().optional().catch(undefined),
  siteUrl: z.string().catch(''),
  smtp: smtpShape,
  signup: z
    .object({
      enableUserCreation: z.boolean().catch(true),
      enableOpenServer: z.boolean().catch(false),
    })
    .catch({ enableUserCreation: true, enableOpenServer: false }),
  // Advertise the Coturn package to the Calls plugin as its TURN relay. While
  // this is on, `main` owns Calls' ICE server list and rewrites it on every
  // start; turning it off clears what the package put there.
  callsTurn: z.boolean().catch(false).default(false),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
