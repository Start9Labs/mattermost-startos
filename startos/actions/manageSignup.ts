import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  enableUserCreation: Value.toggle({
    name: i18n('Allow New User Signups'),
    default: true,
    description: i18n(
      'When disabled, no new accounts can be created — only existing users can sign in. Must be enabled at first launch so the initial System Admin can register.',
    ),
  }),
  enableOpenServer: Value.toggle({
    name: i18n('Open Server (Anyone Can Sign Up)'),
    default: false,
    description: i18n(
      'When enabled, anyone who can reach your Mattermost URL can create an account without an invitation. Leave disabled to restrict signups to people invited by an existing team member.',
    ),
  }),
})

export const manageSignup = sdk.Action.withInput(
  'manage-signup',

  async ({ effects }) => ({
    name: i18n('Configure Signups'),
    description: i18n(
      'Control whether new users can create accounts and whether your server is open to the public.',
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
