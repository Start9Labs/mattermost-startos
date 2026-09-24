import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.11.1:0',
  releaseNotes: {
    en_US: 'Updated Mattermost to 11.11.1 with bug fixes. Full release notes: https://github.com/mattermost/mattermost/releases/tag/v11.11.1',
    es_ES: 'Actualiza Mattermost a 11.11.1 con correcciones de errores. Notas de la versión completas: https://github.com/mattermost/mattermost/releases/tag/v11.11.1',
    de_DE: 'Aktualisiert Mattermost auf 11.11.1 mit Fehlerbehebungen. Vollständige Versionshinweise: https://github.com/mattermost/mattermost/releases/tag/v11.11.1',
    pl_PL: 'Aktualizuje Mattermost do 11.11.1 z poprawkami błędów. Pełne informacje o wydaniu: https://github.com/mattermost/mattermost/releases/tag/v11.11.1',
    fr_FR: 'Met à jour Mattermost vers 11.11.1 avec des corrections de bugs. Notes de version complètes : https://github.com/mattermost/mattermost/releases/tag/v11.11.1',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
