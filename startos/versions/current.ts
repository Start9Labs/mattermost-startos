import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '12.0.1:0',
  releaseNotes: {
    en_US:
      'Updated Mattermost to 12.0.1. Fixes startup with malformed email settings and improves log-path validation. Uses the corrected upstream CA bundle without a packaging layer. Full changes: https://github.com/mattermost/mattermost/compare/v12.0.0...v12.0.1',
    es_ES:
      'Actualiza Mattermost a 12.0.1. Corrige el inicio con ajustes de correo no válidos y mejora la validación de rutas de registro. Usa el conjunto de certificados de CA corregido de upstream sin una capa del paquete. Cambios completos: https://github.com/mattermost/mattermost/compare/v12.0.0...v12.0.1',
    de_DE:
      'Aktualisiert Mattermost auf 12.0.1. Behebt Startprobleme bei ungültigen E-Mail-Einstellungen und verbessert die Prüfung von Protokollpfaden. Verwendet das korrigierte CA-Bündel von Upstream ohne zusätzliche Paketierungsschicht. Alle Änderungen: https://github.com/mattermost/mattermost/compare/v12.0.0...v12.0.1',
    pl_PL:
      'Aktualizuje Mattermost do 12.0.1. Naprawia uruchamianie z nieprawidłowymi ustawieniami poczty i poprawia sprawdzanie ścieżek dzienników. Używa poprawionego zestawu certyfikatów CA upstream bez dodatkowej warstwy pakietu. Wszystkie zmiany: https://github.com/mattermost/mattermost/compare/v12.0.0...v12.0.1',
    fr_FR:
      'Met à jour Mattermost vers 12.0.1. Corrige le démarrage avec des paramètres de messagerie mal formés et améliore la validation des chemins des journaux. Utilise le lot de certificats CA corrigé en amont sans couche supplémentaire du paquet. Tous les changements : https://github.com/mattermost/mattermost/compare/v12.0.0...v12.0.1',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
