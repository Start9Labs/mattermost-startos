import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.10.1:0',
  releaseNotes: {
    en_US: `Updated Mattermost to 11.10.1, a patch release with bug fixes.

- Tightens permission handling around team and channel membership, team invitations, team search filters, and account type switching.
- Tightens sanitization of the post and thread payloads the API returns, and restricts flagging a post in direct and group messages.
- Limits the size of an image the built-in image proxy fetches directly.
- Restores the collapse toggle on a single video attachment.

Full release notes: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    es_ES: `Actualiza Mattermost a 11.10.1, una versión de corrección con arreglos de errores.

- Refuerza la gestión de permisos en la pertenencia a equipos y canales, las invitaciones a equipos, los filtros de búsqueda de equipos y el cambio de tipo de cuenta.
- Refuerza el saneamiento de los datos de publicaciones e hilos que devuelve la API y restringe el marcado de publicaciones en mensajes directos y de grupo.
- Limita el tamaño de las imágenes que el proxy de imágenes integrado descarga directamente.
- Restaura el botón de contraer en los adjuntos de vídeo individuales.

Notas de la versión completas: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    de_DE: `Aktualisiert Mattermost auf 11.10.1, ein Patch-Release mit Fehlerbehebungen.

- Verschärft die Rechteprüfung bei Team- und Kanalmitgliedschaften, Team-Einladungen, Team-Suchfiltern und beim Wechsel des Kontotyps.
- Verschärft die Bereinigung der von der API gelieferten Beitrags- und Thread-Daten und schränkt das Markieren von Beiträgen in Direkt- und Gruppennachrichten ein.
- Begrenzt die Größe eines Bildes, das der eingebaute Bild-Proxy direkt abruft.
- Stellt den Einklappen-Schalter bei einzelnen Video-Anhängen wieder her.

Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    pl_PL: `Aktualizuje Mattermost do 11.10.1, wydanie poprawkowe z poprawkami błędów.

- Zaostrza kontrolę uprawnień przy członkostwie w zespołach i kanałach, zaproszeniach do zespołów, filtrach wyszukiwania zespołów oraz zmianie typu konta.
- Zaostrza oczyszczanie danych postów i wątków zwracanych przez API oraz ogranicza oznaczanie postów w wiadomościach bezpośrednich i grupowych.
- Ogranicza rozmiar obrazu pobieranego bezpośrednio przez wbudowane proxy obrazów.
- Przywraca przycisk zwijania przy pojedynczym załączniku wideo.

Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
    fr_FR: `Met à jour Mattermost vers 11.10.1, une version corrective avec des corrections de bugs.

- Renforce la gestion des permissions pour l'appartenance aux équipes et aux canaux, les invitations d'équipe, les filtres de recherche d'équipe et le changement de type de compte.
- Renforce l'assainissement des données de publications et de fils renvoyées par l'API et restreint le marquage d'une publication dans les messages directs et de groupe.
- Limite la taille d'une image que le proxy d'images intégré récupère directement.
- Rétablit le bouton de repli sur une pièce jointe vidéo unique.

Notes de version complètes : https://docs.mattermost.com/product-overview/mattermost-v11-changelog.html`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
