import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_11_7_0 = VersionInfo.of({
  version: '11.7.0:0',
  releaseNotes: {
    en_US: 'Initial release of Mattermost for StartOS.',
    es_ES: 'Lanzamiento inicial de Mattermost para StartOS.',
    de_DE: 'Erste Veröffentlichung von Mattermost für StartOS.',
    pl_PL: 'Pierwsze wydanie Mattermost dla StartOS.',
    fr_FR: 'Première version de Mattermost pour StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
