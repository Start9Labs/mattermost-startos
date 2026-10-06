import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.11.1:1',
  releaseNotes: {
    en_US: `Updated Mattermost to 11.11.1 with bug fixes. Full release notes: https://github.com/mattermost/mattermost/releases/tag/v11.11.1

- Open UI opens Mattermost at its primary URL.`,
    es_ES: `Actualiza Mattermost a 11.11.1 con correcciones de errores. Notas de la versión completas: https://github.com/mattermost/mattermost/releases/tag/v11.11.1

- Abrir interfaz abre Mattermost en su URL principal.`,
    de_DE: `Aktualisiert Mattermost auf 11.11.1 mit Fehlerbehebungen. Vollständige Versionshinweise: https://github.com/mattermost/mattermost/releases/tag/v11.11.1

- „Oberfläche öffnen“ öffnet Mattermost unter seiner primären URL.`,
    pl_PL: `Aktualizuje Mattermost do 11.11.1 z poprawkami błędów. Pełne informacje o wydaniu: https://github.com/mattermost/mattermost/releases/tag/v11.11.1

- „Otwórz interfejs” otwiera Mattermost pod jego głównym URL.`,
    fr_FR: `Met à jour Mattermost vers 11.11.1 avec des corrections de bugs. Notes de version complètes : https://github.com/mattermost/mattermost/releases/tag/v11.11.1

- Ouvrir l'interface ouvre Mattermost sur son URL principale.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
