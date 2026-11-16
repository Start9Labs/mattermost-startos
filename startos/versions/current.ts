import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '12.1.0:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 12.1.0.

- New: an Out of Office notice above the message box when a direct-message recipient has automatic replies on
- New: "Download all" in the media gallery saves every attachment as one zip file
- New: file search can be turned off from the System Console
- Improved: the rich text editor supports Markdown images and paste
- Requires Firefox 153+, or Chrome or Edge 156+

[Full release notes](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    es_ES: `Mattermost actualizado a 12.1.0.

- Nuevo: un aviso de Fuera de la oficina sobre el cuadro de mensaje cuando el destinatario de un mensaje directo tiene activadas las respuestas automáticas
- Nuevo: "Descargar todo" en la galería de medios guarda todos los adjuntos en un único archivo zip
- Nuevo: la búsqueda de archivos se puede desactivar desde la Consola del sistema
- Mejorado: el editor de texto enriquecido admite imágenes y pegado en Markdown
- Requiere Firefox 153+, o Chrome o Edge 156+

[Notas de la versión completas](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    de_DE: `Mattermost auf 12.1.0 aktualisiert.

- Neu: ein Abwesenheitshinweis über dem Nachrichtenfeld, wenn der Empfänger einer Direktnachricht automatische Antworten aktiviert hat
- Neu: „Alle herunterladen“ in der Mediengalerie speichert alle Anhänge als eine einzige ZIP-Datei
- Neu: die Dateisuche lässt sich in der Systemkonsole abschalten
- Verbessert: der Rich-Text-Editor unterstützt Markdown-Bilder und Einfügen von Markdown
- Erfordert Firefox 153+ oder Chrome bzw. Edge 156+

[Vollständige Versionshinweise](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    pl_PL: `Zaktualizowano Mattermost do 12.1.0.

- Nowość: powiadomienie o nieobecności nad polem wiadomości, gdy odbiorca wiadomości bezpośredniej ma włączone automatyczne odpowiedzi
- Nowość: „Pobierz wszystko” w galerii multimediów zapisuje wszystkie załączniki jako jeden plik zip
- Nowość: wyszukiwanie plików można wyłączyć w Konsoli systemowej
- Ulepszenie: edytor tekstu sformatowanego obsługuje obrazy i wklejanie w Markdown
- Wymaga przeglądarki Firefox 153+ lub Chrome albo Edge 156+

[Pełne informacje o wydaniu](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
    fr_FR: `Mattermost mis à jour vers 12.1.0.

- Nouveau : un avis d'absence au-dessus de la zone de saisie lorsque le destinataire d'un message direct a activé les réponses automatiques
- Nouveau : « Tout télécharger » dans la galerie multimédia enregistre toutes les pièces jointes dans un seul fichier zip
- Nouveau : la recherche de fichiers peut être désactivée depuis la Console système
- Amélioré : l'éditeur de texte enrichi prend en charge les images et le collage Markdown
- Nécessite Firefox 153+, ou Chrome ou Edge 156+

[Notes de version complètes](https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
