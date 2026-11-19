import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  pluginUploads: Value.toggle({
    name: i18n('Allow Plugin Uploads'),
    default: false,
    description: i18n(
      'Let System Admins install plugins by uploading a plugin file in the System Console. A plugin runs inside the Mattermost server with full access to its data, so while this is on, anyone holding a System Admin account can run code of their choosing on your server. Plugins already installed keep working either way.',
    ),
  }),
})

export const managePluginUploads = sdk.Action.withInput(
  'manage-plugin-uploads',

  async ({ effects }) => ({
    name: i18n('Configure Plugin Uploads'),
    description: i18n(
      'Control whether System Admins can install plugins by uploading them in the System Console.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    pluginUploads:
      (await storeJson.read((s) => s.pluginUploads).once()) ?? false,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, { pluginUploads: input.pluginUploads }),
)
