import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.9.0:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 11.9.0.

This release also migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later).

Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    es_ES: `Actualiza Mattermost a 11.9.0.

Esta versión también migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior).

Notas de la versión completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    de_DE: `Aktualisiert Mattermost auf 11.9.0.

Diese Version stellt das Paket außerdem auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer).

Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    pl_PL: `Aktualizuje Mattermost do 11.9.0.

Ta wersja przenosi też pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego).

Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    fr_FR: `Met à jour Mattermost vers 11.9.0.

Cette version fait également passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure).

Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
