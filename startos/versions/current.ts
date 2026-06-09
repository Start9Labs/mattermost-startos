import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.8.0:0',
  releaseNotes: {
    en_US:
      'Updated Mattermost to 11.8.0, a feature and maintenance release with new functionality, bug fixes, and security patches. Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    es_ES:
      'Actualiza Mattermost a 11.8.0, una versión de funciones y mantenimiento con nuevas funcionalidades, correcciones de errores y parches de seguridad. Notas completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    de_DE:
      'Aktualisiert Mattermost auf 11.8.0, ein Funktions- und Wartungsrelease mit neuen Funktionen, Fehlerbehebungen und Sicherheitskorrekturen. Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    pl_PL:
      'Aktualizuje Mattermost do 11.8.0, wydanie z nowymi funkcjami, poprawkami błędów i poprawkami bezpieczeństwa. Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
    fr_FR:
      'Met à jour Mattermost vers 11.8.0, une version de fonctionnalités et de maintenance avec de nouvelles fonctionnalités, des corrections de bugs et des correctifs de sécurité. Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
