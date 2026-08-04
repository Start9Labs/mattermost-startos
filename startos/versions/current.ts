import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.10.0:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 11.10.0.

- New optional rich-text (WYSIWYG) message editor, with full markdown round-trip.
- Posts with several images or videos now use a media gallery layout, and single videos get an inline preview.
- Interactive dialogs support a file upload element.
- The upgrade applies two backwards-compatible database migrations (a new index on PropertyValues, created concurrently, and a nullable column on user access tokens); no downtime is expected.

Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    es_ES: `Actualiza Mattermost a 11.10.0.

- Nuevo editor de mensajes de texto enriquecido (WYSIWYG) opcional, con conversión completa desde y hacia markdown.
- Las publicaciones con varias imágenes o vídeos usan ahora una galería multimedia, y los vídeos individuales tienen vista previa integrada.
- Los diálogos interactivos admiten un elemento de subida de archivos.
- La actualización aplica dos migraciones de base de datos retrocompatibles (un nuevo índice en PropertyValues, creado de forma concurrente, y una columna que admite nulos en los tokens de acceso de usuario); no se espera tiempo de inactividad.

Notas de la versión completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    de_DE: `Aktualisiert Mattermost auf 11.10.0.

- Neuer optionaler Rich-Text-Editor (WYSIWYG) für Nachrichten, mit vollständiger Markdown-Rückumwandlung.
- Beiträge mit mehreren Bildern oder Videos verwenden jetzt eine Mediengalerie, einzelne Videos erhalten eine eingebettete Vorschau.
- Interaktive Dialoge unterstützen ein Element zum Hochladen von Dateien.
- Das Update führt zwei abwärtskompatible Datenbankmigrationen aus (ein neuer, nebenläufig erstellter Index auf PropertyValues und eine nullbare Spalte für Benutzerzugriffstoken); es wird keine Ausfallzeit erwartet.

Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    pl_PL: `Aktualizuje Mattermost do 11.10.0.

- Nowy opcjonalny edytor wiadomości z formatowaniem (WYSIWYG), z pełną konwersją do i z markdown.
- Wpisy z kilkoma obrazami lub filmami korzystają teraz z galerii multimediów, a pojedyncze filmy mają podgląd osadzony w treści.
- Interaktywne okna dialogowe obsługują element przesyłania plików.
- Aktualizacja wykonuje dwie zgodne wstecz migracje bazy danych (nowy indeks na PropertyValues tworzony współbieżnie oraz kolumnę dopuszczającą wartości puste w tokenach dostępu użytkownika); nie przewiduje się przestoju.

Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    fr_FR: `Met à jour Mattermost vers 11.10.0.

- Nouvel éditeur de messages en texte enrichi (WYSIWYG) optionnel, avec conversion complète depuis et vers le markdown.
- Les publications contenant plusieurs images ou vidéos utilisent désormais une galerie multimédia, et les vidéos seules bénéficient d'un aperçu intégré.
- Les dialogues interactifs prennent en charge un élément d'envoi de fichier.
- La mise à jour applique deux migrations de base de données rétrocompatibles (un nouvel index sur PropertyValues, créé de façon concurrente, et une colonne acceptant les valeurs nulles pour les jetons d'accès utilisateur) ; aucune interruption de service n'est attendue.

Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
