import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.11.0:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 11.11.0.

- Adds a Hide Archived option to the channel browser and hides archived channels by default.
- Prevents messages from being sent to the previously viewed channel after using /msg or the channel switcher.
- Fixes rich-text editor focus, Enter-key crashes, and slash commands that include URLs.
- Hardens OAuth, plugin requests, document processing, role validation, and bot credential cleanup.

Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    es_ES: `Actualiza Mattermost a 11.11.0.

- Añade una opción para ocultar canales archivados en el explorador de canales y los oculta de forma predeterminada.
- Evita que los mensajes se envíen al canal visto anteriormente después de usar /msg o el selector de canales.
- Corrige el foco del editor de texto enriquecido, los cierres al pulsar Intro y los comandos de barra que incluyen URL.
- Refuerza OAuth, las solicitudes de complementos, el procesamiento de documentos, la validación de roles y la limpieza de credenciales de bots.

Notas de la versión completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    de_DE: `Aktualisiert Mattermost auf 11.11.0.

- Fügt im Kanalbrowser eine Option zum Ausblenden archivierter Kanäle hinzu und blendet diese standardmäßig aus.
- Verhindert, dass Nachrichten nach der Verwendung von /msg oder dem Kanalwechsler an den zuvor angezeigten Kanal gesendet werden.
- Behebt Fokusprobleme, Abstürze durch die Eingabetaste und Schrägstrichbefehle mit URLs im Rich-Text-Editor.
- Härtet OAuth, Plugin-Anfragen, Dokumentverarbeitung, Rollenvalidierung und die Bereinigung von Bot-Zugangsdaten ab.

Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    pl_PL: `Aktualizuje Mattermost do 11.11.0.

- Dodaje opcję ukrywania zarchiwizowanych kanałów w przeglądarce kanałów i domyślnie je ukrywa.
- Zapobiega wysyłaniu wiadomości do poprzednio oglądanego kanału po użyciu /msg lub przełącznika kanałów.
- Naprawia problemy z fokusem edytora tekstu sformatowanego, awarie po naciśnięciu Enter oraz polecenia ukośnikowe zawierające adresy URL.
- Wzmacnia zabezpieczenia OAuth, żądań wtyczek, przetwarzania dokumentów, walidacji ról i usuwania danych uwierzytelniających botów.

Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    fr_FR: `Met à jour Mattermost vers 11.11.0.

- Ajoute une option pour masquer les canaux archivés dans le navigateur de canaux et les masque par défaut.
- Empêche l'envoi de messages vers le canal précédemment consulté après l'utilisation de /msg ou du sélecteur de canaux.
- Corrige les problèmes de focus de l'éditeur de texte enrichi, les plantages liés à la touche Entrée et les commandes slash contenant des URL.
- Renforce OAuth, les requêtes des extensions, le traitement des documents, la validation des rôles et le nettoyage des identifiants des bots.

Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
