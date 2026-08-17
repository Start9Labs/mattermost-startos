import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  callsTurn: Value.toggle({
    name: i18n('Relay Calls Through Coturn'),
    default: false,
    description: i18n(
      'Relay Mattermost Calls through the Coturn service so they connect when a participant is behind NAT or a restrictive firewall. Requires the Calls plugin to be installed in Mattermost, and Coturn to be installed and running with a public domain of its own; until both are, calls fall back to a direct connection.',
    ),
  }),
})

export const manageCallsTurn = sdk.Action.withInput(
  'manage-calls-turn',

  async ({ effects }) => ({
    name: i18n('Configure Call Relay'),
    description: i18n(
      "Hand the Calls plugin the Coturn service's address and shared secret, so calls that cannot connect directly are relayed.",
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    callsTurn: (await storeJson.read((s) => s.callsTurn).once()) ?? false,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, { callsTurn: input.callsTurn }),
)
