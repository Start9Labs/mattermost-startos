import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.8.1:0',
  releaseNotes: {
    en_US:
      'Updated Mattermost to 11.8.1, a patch release with bug fixes. Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    es_ES:
      'Actualiza Mattermost a 11.8.1, una versión de corrección con arreglos de errores. Notas completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    de_DE:
      'Aktualisiert Mattermost auf 11.8.1, ein Patch-Release mit Fehlerbehebungen. Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    pl_PL:
      'Aktualizuje Mattermost do 11.8.1, wydanie poprawkowe z poprawkami błędów. Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    fr_FR:
      'Met à jour Mattermost vers 11.8.1, une version corrective avec des corrections de bugs. Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
