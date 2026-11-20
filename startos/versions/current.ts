import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { configJson } from '../fileModels/config.json'
import { privacyDefaults } from '../utils'

export const current = VersionInfo.of({
  version: '12.1.0:1',
  releaseNotes: {
    en_US: `Plugin uploads, and most of Mattermost's contact with Mattermost's own servers, are turned off.

- Uploading plugins in the System Console is off. Plugins you already installed keep working; to upload a new plugin or a new version of one, turn on uploads in the Configure Plugin Uploads action.
- Mattermost does not check Mattermost's servers for security alerts, show Mattermost's in-product notices, or list plugins from the online Marketplace. Each can be turned back on in the System Console.
- Mobile push notifications show only the sender's name, not the channel or the message. Change this under System Console → Site Configuration → Notifications → Push Notification Contents.`,
    es_ES: `Se desactivan la subida de complementos y la mayor parte del contacto de Mattermost con los servidores de Mattermost.

- La subida de complementos en la Consola del sistema está desactivada. Los complementos que ya instalaste siguen funcionando; para subir un complemento nuevo o una nueva versión de uno, activa la subida en la acción Configurar la subida de complementos.
- Mattermost no consulta los servidores de Mattermost en busca de alertas de seguridad, no muestra los avisos de Mattermost dentro del producto ni lista complementos del Marketplace en línea. Cada uno puede volver a activarse en la Consola del sistema.
- Las notificaciones push móviles muestran solo el nombre del remitente, no el canal ni el mensaje. Cámbialo en Consola del sistema → Configuración del sitio → Notificaciones → Contenido de las notificaciones push.`,
    de_DE: `Plugin-Uploads und der größte Teil des Kontakts von Mattermost zu den Servern von Mattermost werden ausgeschaltet.

- Das Hochladen von Plugins in der Systemkonsole ist ausgeschaltet. Bereits installierte Plugins funktionieren weiter; um ein neues Plugin oder eine neue Version davon hochzuladen, schalten Sie Uploads in der Aktion „Plugin-Uploads konfigurieren“ ein.
- Mattermost fragt die Server von Mattermost nicht nach Sicherheitswarnungen ab, zeigt keine produktinternen Hinweise von Mattermost an und listet keine Plugins aus dem Online-Marketplace. Jedes davon lässt sich in der Systemkonsole wieder einschalten.
- Mobile Push-Benachrichtigungen zeigen nur den Namen des Absenders, nicht den Kanal oder die Nachricht. Ändern Sie dies unter Systemkonsole → Site-Konfiguration → Benachrichtigungen → Inhalt von Push-Benachrichtigungen.`,
    pl_PL: `Przesyłanie wtyczek i większość kontaktu Mattermost z serwerami Mattermost zostają wyłączone.

- Przesyłanie wtyczek w Konsoli systemowej jest wyłączone. Już zainstalowane wtyczki działają dalej; aby przesłać nową wtyczkę lub jej nową wersję, włącz przesyłanie w akcji Konfiguruj przesyłanie wtyczek.
- Mattermost nie odpytuje serwerów Mattermost o alerty bezpieczeństwa, nie wyświetla komunikatów Mattermost w produkcie i nie pokazuje wtyczek z internetowego Marketplace. Każdą z tych funkcji można ponownie włączyć w Konsoli systemowej.
- Mobilne powiadomienia push pokazują tylko nazwę nadawcy, bez kanału i treści wiadomości. Zmienisz to w Konsola systemowa → Konfiguracja witryny → Powiadomienia → Treść powiadomień push.`,
    fr_FR: `Le téléversement de plugins et la plupart des échanges de Mattermost avec les serveurs de Mattermost sont désactivés.

- Le téléversement de plugins dans la Console système est désactivé. Les plugins déjà installés continuent de fonctionner ; pour téléverser un nouveau plugin ou une nouvelle version d'un plugin, activez le téléversement dans l'action Configurer le téléversement de plugins.
- Mattermost ne consulte pas les serveurs de Mattermost pour les alertes de sécurité, n'affiche pas les avis de Mattermost dans le produit et ne liste pas les plugins du Marketplace en ligne. Chacun peut être réactivé dans la Console système.
- Les notifications push mobiles n'affichent que le nom de l'expéditeur, ni le canal ni le message. Modifiez cela dans Console système → Configuration du site → Notifications → Contenu des notifications push.`,
  },
  migrations: {
    up: async ({ effects }) => {
      await configJson.merge(effects, privacyDefaults)
    },
    down: IMPOSSIBLE,
  },
})
