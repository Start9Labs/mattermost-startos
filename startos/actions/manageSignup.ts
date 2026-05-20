import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  enableUserCreation: Value.toggle({
    name: i18n('Allow Account Creation'),
    default: true,
    description: i18n(
      'Master switch for all new accounts. When off, nobody new can join — not even by invitation. Leave on unless you want to freeze the member list entirely.',
    ),
  }),
  enableOpenServer: Value.toggle({
    name: i18n('Public Signups'),
    default: false,
    description: i18n(
      'When enabled, anyone who can reach your Mattermost URL can self-register. When disabled (recommended), the server is invite-only — new members join via an invite link or email invitation. The first account always becomes System Admin regardless.',
    ),
  }),
})

export const manageSignup = sdk.Action.withInput(
  'manage-signup',

  async ({ effects }) => ({
    name: i18n('Configure Signups'),
    description: i18n(
      'Control whether new accounts can be created at all, and whether sign-up is public or invite-only.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => storeJson.read((s) => s.signup).once(),

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      signup: {
        enableUserCreation: input.enableUserCreation,
        enableOpenServer: input.enableOpenServer,
      },
    }),
)
