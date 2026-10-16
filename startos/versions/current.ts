import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '12.0.0:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 12.0.0 and start-sdk to 3.0.6.

- Supports longer messages (up to 262,144 characters), per-channel hiding of join/leave messages, and a React 19 web client.
- Before updating, take a backup and update community plugins to versions compatible with v12 and React 19. Older frontend plugins may fail or remain disabled.
- Mattermost migrates the database automatically, briefly locking message tables and rebuilding the post search index. Large installations need a maintenance window, time, and disk space for this I/O-intensive rebuild; database post search runs without that index until it finishes. The bundled PostgreSQL 16 meets the new minimum of 15; no database major upgrade is needed.
- Review custom integrations before updating: OpenSearch 1.x and atmos/camo are no longer supported, and personal access tokens can no longer override post identity. Use incoming webhooks or bot accounts instead. Slack imports now use mmetl with mmctl import.

[Full release notes and compatibility changes](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    es_ES: `Actualiza Mattermost a 12.0.0 y start-sdk a 3.0.6.

- Admite mensajes más largos (hasta 262.144 caracteres), ocultar los mensajes de entrada y salida por canal y un cliente web con React 19.
- Antes de actualizar, crea una copia de seguridad y actualiza los complementos comunitarios a versiones compatibles con v12 y React 19. Los complementos antiguos de interfaz pueden fallar o permanecer desactivados.
- Mattermost migra la base de datos automáticamente, bloquea brevemente las tablas de mensajes y reconstruye el índice de búsqueda de publicaciones. Las instalaciones grandes necesitan una ventana de mantenimiento, tiempo y espacio en disco para esta reconstrucción intensiva en E/S; la búsqueda de publicaciones en la base de datos funciona sin ese índice hasta que termina. PostgreSQL 16, incluido en el paquete, cumple el nuevo mínimo de 15; no es necesario cambiar de versión principal de la base de datos.
- Revisa las integraciones personalizadas antes de actualizar: OpenSearch 1.x y atmos/camo dejan de ser compatibles y los tokens de acceso personal ya no pueden suplantar la identidad de las publicaciones. Usa webhooks entrantes o cuentas de bot. Las importaciones de Slack ahora usan mmetl con mmctl import.

[Notas completas y cambios de compatibilidad](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    de_DE: `Aktualisiert Mattermost auf 12.0.0 und start-sdk auf 3.0.6.

- Unterstützt längere Nachrichten (bis zu 262.144 Zeichen), das kanalweise Ausblenden von Beitritts- und Austrittsmeldungen und einen Webclient mit React 19.
- Vor dem Update ein Backup erstellen und Community-Plugins auf mit v12 und React 19 kompatible Versionen aktualisieren. Ältere Frontend-Plugins können fehlschlagen oder deaktiviert bleiben.
- Mattermost migriert die Datenbank automatisch, sperrt dabei kurz die Nachrichtentabellen und baut den Beitragssuchindex neu auf. Große Installationen benötigen ein Wartungsfenster, Zeit und Speicherplatz für diesen E/A-intensiven Neuaufbau; die Datenbanksuche nach Beiträgen läuft bis zum Abschluss ohne diesen Index. Das mitgelieferte PostgreSQL 16 erfüllt die neue Mindestversion 15; kein Datenbank-Hauptversionswechsel ist nötig.
- Eigene Integrationen vor dem Update prüfen: OpenSearch 1.x und atmos/camo werden nicht mehr unterstützt und persönliche Zugriffstoken können die Beitragsidentität nicht mehr überschreiben. Stattdessen eingehende Webhooks oder Bot-Konten verwenden. Slack-Importe erfolgen jetzt mit mmetl und mmctl import.

[Vollständige Versionshinweise und Kompatibilitätsänderungen](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    pl_PL: `Aktualizuje Mattermost do 12.0.0 i start-sdk do 3.0.6.

- Obsługuje dłuższe wiadomości (do 262 144 znaków), ukrywanie komunikatów o dołączaniu i opuszczaniu kanału oraz klienta WWW z React 19.
- Przed aktualizacją wykonaj kopię zapasową i zaktualizuj wtyczki społecznościowe do wersji zgodnych z v12 i React 19. Starsze wtyczki interfejsu mogą nie działać lub pozostać wyłączone.
- Mattermost automatycznie migruje bazę danych, na krótko blokując tabele wiadomości i odbudowując indeks wyszukiwania postów. Duże instalacje wymagają okna serwisowego, czasu i miejsca na dysku na tę intensywną operację wejścia/wyjścia; wyszukiwanie postów w bazie działa bez tego indeksu do zakończenia odbudowy. Dołączony PostgreSQL 16 spełnia nowe minimum 15; zmiana głównej wersji bazy nie jest potrzebna.
- Przed aktualizacją sprawdź własne integracje: OpenSearch 1.x i atmos/camo nie są już obsługiwane, a osobiste tokeny dostępu nie mogą nadpisywać tożsamości postów. Użyj przychodzących webhooków lub kont botów. Import ze Slacka korzysta teraz z mmetl i mmctl import.

[Pełne informacje o wydaniu i zmianach zgodności](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    fr_FR: `Met à jour Mattermost vers 12.0.0 et start-sdk vers 3.0.6.

- Prend en charge des messages plus longs (jusqu'à 262 144 caractères), le masquage des messages d'arrivée et de départ par canal et un client web avec React 19.
- Avant la mise à jour, faites une sauvegarde et mettez les plugins communautaires à jour vers des versions compatibles avec v12 et React 19. Les anciens plugins d'interface peuvent échouer ou rester désactivés.
- Mattermost migre automatiquement la base de données, verrouille brièvement les tables de messages et reconstruit l'index de recherche des publications. Les grandes installations nécessitent une fenêtre de maintenance, du temps et de l'espace disque pour cette reconstruction intensive en E/S ; la recherche de publications dans la base fonctionne sans cet index jusqu'à la fin. PostgreSQL 16, fourni avec le paquet, satisfait au nouveau minimum de 15 ; aucun changement de version majeure de la base n'est nécessaire.
- Vérifiez les intégrations personnalisées avant la mise à jour : OpenSearch 1.x et atmos/camo ne sont plus pris en charge, et les jetons d'accès personnels ne peuvent plus modifier l'identité des publications. Utilisez des webhooks entrants ou des comptes de bot. Les imports Slack utilisent désormais mmetl avec mmctl import.

[Notes complètes et changements de compatibilité](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
