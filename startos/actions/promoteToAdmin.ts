import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mmctlCommand, mmctlEnv, mmctlMounts } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  user: Value.text({
    name: i18n('Username or Email'),
    required: true,
    default: null,
    placeholder: 'alice',
    description: i18n(
      'The username or email address of the user to grant System Admin privileges.',
    ),
  }),
})

export const promoteToAdmin = sdk.Action.withInput(
  'promote-to-admin',

  async ({ effects }) => ({
    name: i18n('Promote to System Admin'),
    description: i18n(
      'Grant System Admin privileges to an existing user. Useful when the original admin leaves or is locked out and you need to elevate a regular account.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Recovery'),
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'mattermost' },
      mmctlMounts,
      'mmctl-promote',
      (sub) =>
        sub.execFail(mmctlCommand(['roles', 'system-admin', input.user]), {
          env: mmctlEnv,
        }),
    )

    return {
      version: '1',
      title: i18n('Promoted'),
      message: i18n('${user} is now a System Admin.', { user: input.user }),
      result: null,
    }
  },
)
