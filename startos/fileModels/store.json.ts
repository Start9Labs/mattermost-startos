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
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
