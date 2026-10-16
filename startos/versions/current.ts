import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '12.0.0:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 12.0.0.

- Supports longer messages (up to 262,144 characters), per-channel hiding of join/leave messages, and a React 19 web client.
- Before updating, update community plugins to versions compatible with v12 and React 19. Older frontend plugins may fail or remain disabled.
- The first start after updating migrates the database and can take a long time on large installations; message search may be incomplete until it finishes. Take a backup first.
- Review custom integrations before updating: OpenSearch 1.x and atmos/camo are no longer supported, and personal access tokens can no longer override post identity. Use incoming webhooks or bot accounts instead. Slack imports now use mmetl with mmctl import.

[Full release notes and compatibility changes](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    es_ES: `Actualiza Mattermost a 12.0.0.

- Admite mensajes más largos (hasta 262.144 caracteres), ocultar los mensajes de entrada y salida por canal y un cliente web con React 19.
- Antes de actualizar, actualiza los complementos comunitarios a versiones compatibles con v12 y React 19. Los complementos antiguos de interfaz pueden fallar o permanecer desactivados.
- El primer inicio tras la actualización migra la base de datos y puede tardar mucho en instalaciones grandes; la búsqueda de mensajes puede ser incompleta hasta que termine. Crea una copia de seguridad antes de actualizar.
- Revisa las integraciones personalizadas antes de actualizar: OpenSearch 1.x y atmos/camo dejan de ser compatibles y los tokens de acceso personal ya no pueden suplantar la identidad de las publicaciones. Usa webhooks entrantes o cuentas de bot. Las importaciones de Slack ahora usan mmetl con mmctl import.

[Notas completas y cambios de compatibilidad](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    de_DE: `Aktualisiert Mattermost auf 12.0.0.

- Unterstützt längere Nachrichten (bis zu 262.144 Zeichen), das kanalweise Ausblenden von Beitritts- und Austrittsmeldungen und einen Webclient mit React 19.
- Vor dem Update Community-Plugins auf mit v12 und React 19 kompatible Versionen aktualisieren. Ältere Frontend-Plugins können fehlschlagen oder deaktiviert bleiben.
- Der erste Start nach dem Update migriert die Datenbank und kann bei großen Installationen lange dauern; die Nachrichtensuche kann bis zum Abschluss unvollständig sein. Vor dem Update ein Backup erstellen.
- Eigene Integrationen vor dem Update prüfen: OpenSearch 1.x und atmos/camo werden nicht mehr unterstützt und persönliche Zugriffstoken können die Beitragsidentität nicht mehr überschreiben. Stattdessen eingehende Webhooks oder Bot-Konten verwenden. Slack-Importe erfolgen jetzt mit mmetl und mmctl import.

[Vollständige Versionshinweise und Kompatibilitätsänderungen](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    pl_PL: `Aktualizuje Mattermost do 12.0.0.

- Obsługuje dłuższe wiadomości (do 262 144 znaków), ukrywanie komunikatów o dołączaniu i opuszczaniu kanału oraz klienta WWW z React 19.
- Przed aktualizacją zaktualizuj wtyczki społecznościowe do wersji zgodnych z v12 i React 19. Starsze wtyczki interfejsu mogą nie działać lub pozostać wyłączone.
- Pierwsze uruchomienie po aktualizacji migruje bazę danych i może długo trwać w dużych instalacjach; wyszukiwanie wiadomości może być niepełne do jego zakończenia. Przed aktualizacją wykonaj kopię zapasową.
- Przed aktualizacją sprawdź własne integracje: OpenSearch 1.x i atmos/camo nie są już obsługiwane, a osobiste tokeny dostępu nie mogą nadpisywać tożsamości postów. Użyj przychodzących webhooków lub kont botów. Import ze Slacka korzysta teraz z mmetl i mmctl import.

[Pełne informacje o wydaniu i zmianach zgodności](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    fr_FR: `Met à jour Mattermost vers 12.0.0.

- Prend en charge des messages plus longs (jusqu'à 262 144 caractères), le masquage des messages d'arrivée et de départ par canal et un client web avec React 19.
- Avant la mise à jour, mettez les plugins communautaires à jour vers des versions compatibles avec v12 et React 19. Les anciens plugins d'interface peuvent échouer ou rester désactivés.
- Le premier démarrage après la mise à jour migre la base de données et peut être long sur les grandes installations ; la recherche de messages peut être incomplète jusqu'à la fin. Faites une sauvegarde avant la mise à jour.
- Vérifiez les intégrations personnalisées avant la mise à jour : OpenSearch 1.x et atmos/camo ne sont plus pris en charge, et les jetons d'accès personnels ne peuvent plus modifier l'identité des publications. Utilisez des webhooks entrants ou des comptes de bot. Les imports Slack utilisent désormais mmetl avec mmctl import.

[Notes complètes et changements de compatibilité](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
