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
      'The username or email address of the System Admin to demote to a regular user.',
    ),
  }),
})

export const demoteFromAdmin = sdk.Action.withInput(
  'demote-from-admin',

  async ({ effects }) => ({
    name: i18n('Demote from System Admin'),
    description: i18n(
      'Revoke System Admin privileges from a user, returning them to regular member status.',
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
      'mmctl-demote',
      (sub) =>
        sub.execFail(mmctlCommand(['roles', 'member', input.user]), {
          env: mmctlEnv,
        }),
    )

    return {
      version: '1',
      title: i18n('Demoted'),
      message: i18n('${user} is no longer a System Admin.', {
        user: input.user,
      }),
      result: null,
    }
  },
)
