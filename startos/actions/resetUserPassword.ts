import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mmctlCommand, mmctlEnv, mmctlMounts } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  user: Value.text({
    name: i18n('Username or Email'),
    required: true,
    default: null,
    placeholder: 'admin',
    description: i18n(
      'The username or email address of the account whose password you want to reset.',
    ),
  }),
})

export const resetUserPassword = sdk.Action.withInput(
  'reset-user-password',

  async ({ effects }) => ({
    name: i18n('Reset User Password'),
    description: i18n(
      'Generate a new password for a Mattermost user. Useful when an admin gets locked out or forgets their password.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Recovery'),
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {},

  async ({ effects, input }) => {
    const newPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 22,
    })

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'mattermost' },
      mmctlMounts,
      'mmctl-reset-password',
      (sub) =>
        sub.execFail(
          mmctlCommand([
            'user',
            'change-password',
            input.user,
            '--password',
            newPassword,
          ]),
          { env: mmctlEnv },
        ),
    )

    return {
      version: '1',
      title: i18n('Password Reset'),
      message: i18n(
        'The user password has been reset. Use the new password below to log in.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: input.user,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('New Password'),
            description: null,
            value: newPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
