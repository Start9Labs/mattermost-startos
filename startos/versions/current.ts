import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.8.3:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 11.8.3.

- Includes a medium severity security fix; upgrading is recommended.
- Fixes the Bot Accounts page loading at most 200 bots, which hid newer accounts from the list and from search.
- Stops the System Console from saving a stale configuration by refreshing the admin's snapshot of it whenever it changes.
- Tightens validation when updating channel member roles through the API.

Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    es_ES: `Actualiza Mattermost a 11.8.3.

- Incluye una corrección de seguridad de gravedad media; se recomienda actualizar.
- Corrige la página de Cuentas de bot, que cargaba como máximo 200 bots y ocultaba las cuentas más recientes de la lista y de la búsqueda.
- Evita que la Consola del Sistema guarde una configuración obsoleta, actualizando la copia del administrador cada vez que cambia.
- Refuerza la validación al actualizar los roles de los miembros de un canal mediante la API.

Notas de la versión completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    de_DE: `Aktualisiert Mattermost auf 11.8.3.

- Enthält eine Sicherheitskorrektur mittleren Schweregrads; ein Update wird empfohlen.
- Behebt, dass die Seite "Bot-Konten" höchstens 200 Bots lud und neuere Konten dadurch in Liste und Suche fehlten.
- Verhindert, dass die Systemkonsole eine veraltete Konfiguration speichert, indem die Momentaufnahme des Administrators bei jeder Änderung aktualisiert wird.
- Verschärft die Validierung beim Ändern von Kanalmitglieder-Rollen über die API.

Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    pl_PL: `Aktualizuje Mattermost do 11.8.3.

- Zawiera poprawkę bezpieczeństwa o średnim stopniu istotności; aktualizacja jest zalecana.
- Naprawia stronę Kont botów, która wczytywała najwyżej 200 botów, ukrywając nowsze konta na liście i w wyszukiwaniu.
- Zapobiega zapisywaniu nieaktualnej konfiguracji przez Konsolę systemową, odświeżając jej kopię u administratora przy każdej zmianie.
- Zaostrza walidację przy zmianie ról członków kanału przez API.

Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    fr_FR: `Met à jour Mattermost vers 11.8.3.

- Comprend un correctif de sécurité de gravité moyenne ; la mise à jour est recommandée.
- Corrige la page Comptes de bots qui ne chargeait au plus que 200 bots, masquant les comptes récents de la liste et de la recherche.
- Empêche la Console système d'enregistrer une configuration obsolète en actualisant l'instantané de l'administrateur à chaque modification.
- Renforce la validation lors de la mise à jour des rôles des membres d'un canal via l'API.

Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
