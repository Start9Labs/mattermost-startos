import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_11_7_1 = VersionInfo.of({
  version: '11.7.1:0',
  releaseNotes: {
    en_US:
      'Bumps Mattermost → 11.7.1. Fixes the Recovery and Management actions, which previously failed with an mmctl error.',
    es_ES:
      'Actualiza Mattermost → 11.7.1. Corrige las acciones de Recuperación y Administración, que antes fallaban con un error de mmctl.',
    de_DE:
      'Aktualisiert Mattermost → 11.7.1. Behebt die Wiederherstellungs- und Verwaltungsaktionen, die zuvor mit einem mmctl-Fehler fehlschlugen.',
    pl_PL:
      'Aktualizuje Mattermost → 11.7.1. Naprawia akcje odzyskiwania i zarządzania, które wcześniej kończyły się błędem mmctl.',
    fr_FR:
      'Met à jour Mattermost → 11.7.1. Corrige les actions de récupération et de gestion, qui échouaient auparavant avec une erreur mmctl.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
