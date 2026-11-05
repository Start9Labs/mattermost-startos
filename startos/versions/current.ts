import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '12.0.2:0',
  releaseNotes: {
    en_US:
      'Updated Mattermost to 12.0.2 with medium- to high-severity security fixes and stricter log-path validation. Database upgrades no longer widen existing message columns, avoiding an expensive search-index rebuild; columns already widened remain unchanged. Startup rebuilds an attribute compatibility view and may take longer with large attribute datasets. Requires StartOS 0.4.1 or later. Full release notes: https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html',
    es_ES:
      'Actualiza Mattermost a 12.0.2 con correcciones de seguridad de gravedad media a alta y una validación más estricta de las rutas de registro. Las actualizaciones de la base de datos ya no amplían las columnas de mensajes existentes, evitando una costosa reconstrucción del índice de búsqueda; las columnas ya ampliadas no cambian. El inicio reconstruye una vista de compatibilidad de atributos y puede tardar más con muchos datos de atributos. Requiere StartOS 0.4.1 o posterior. Notas completas: https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html',
    de_DE:
      'Aktualisiert Mattermost auf 12.0.2 mit Sicherheitskorrekturen mittleren bis hohen Schweregrads und strengerer Prüfung der Protokollpfade. Datenbank-Upgrades erweitern bestehende Nachrichtenspalten nicht mehr und vermeiden damit einen aufwendigen Neuaufbau des Suchindex; bereits erweiterte Spalten bleiben unverändert. Beim Start wird eine Kompatibilitätsansicht für Attribute neu aufgebaut; große Attributdatenbestände können den Start verzögern. Erfordert StartOS 0.4.1 oder neuer. Vollständige Versionshinweise: https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html',
    pl_PL:
      'Aktualizuje Mattermost do 12.0.2 z poprawkami bezpieczeństwa o średnim i wysokim poziomie zagrożenia oraz dokładniejszą walidacją ścieżek dzienników. Aktualizacje bazy danych nie poszerzają już istniejących kolumn wiadomości, unikając kosztownej przebudowy indeksu wyszukiwania; wcześniej poszerzone kolumny pozostają bez zmian. Podczas uruchamiania odbudowywany jest widok zgodności atrybutów; duże zbiory danych atrybutów mogą wydłużyć start. Wymaga StartOS 0.4.1 lub nowszego. Pełne informacje o wydaniu: https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html',
    fr_FR:
      'Met à jour Mattermost vers 12.0.2 avec des correctifs de sécurité de gravité moyenne à élevée et une validation plus stricte des chemins des journaux. Les mises à niveau de la base de données n’élargissent plus les colonnes de messages existantes, évitant une reconstruction coûteuse de l’index de recherche ; les colonnes déjà élargies restent inchangées. Le démarrage reconstruit une vue de compatibilité des attributs et peut prendre plus de temps avec de grands volumes d’attributs. Nécessite StartOS 0.4.1 ou ultérieur. Notes complètes : https://docs.mattermost.com/product-overview/mattermost-v12-changelog.html',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
