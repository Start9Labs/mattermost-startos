import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.7.2:0',
  releaseNotes: {
    en_US: 'Bumps Mattermost → 11.7.2 (security fixes).',
    es_ES: 'Actualiza Mattermost → 11.7.2 (correcciones de seguridad).',
    de_DE: 'Aktualisiert Mattermost → 11.7.2 (Sicherheitskorrekturen).',
    pl_PL: 'Aktualizuje Mattermost → 11.7.2 (poprawki bezpieczeństwa).',
    fr_FR: 'Met à jour Mattermost → 11.7.2 (corrections de sécurité).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
