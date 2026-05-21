import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_11_7_1 = VersionInfo.of({
  version: '11.7.1:0',
  releaseNotes: {
    en_US: 'Bumps Mattermost → 11.7.1.',
    es_ES: 'Actualiza Mattermost → 11.7.1.',
    de_DE: 'Aktualisiert Mattermost → 11.7.1.',
    pl_PL: 'Aktualizuje Mattermost → 11.7.1.',
    fr_FR: 'Met à jour Mattermost → 11.7.1.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
