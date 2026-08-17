import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '11.10.0:1',
  releaseNotes: {
    en_US: `New optional dependency on **Coturn** relays Mattermost Calls through NAT and restrictive firewalls, so a call connects even when a participant is behind one. Turn it on with the **Configure Call Relay** action; it needs the Calls plugin installed in Mattermost and Coturn running with a public domain of its own. While it is on, this package owns Calls' ICE Servers Configurations field — turning it off clears it again.`,
    es_ES: `La nueva dependencia opcional de **Coturn** retransmite las llamadas de Mattermost a través de NAT y de cortafuegos restrictivos, de modo que una llamada se establece incluso cuando un participante está detrás de uno. Actívela con la acción **Configurar la retransmisión de llamadas**; requiere el complemento Calls instalado en Mattermost y Coturn en ejecución con su propio dominio público. Mientras esté activada, este paquete es el dueño del campo «ICE Servers Configurations» de Calls; al desactivarla, vuelve a vaciarse.`,
    de_DE: `Die neue optionale Abhängigkeit **Coturn** leitet Mattermost-Anrufe durch NAT und restriktive Firewalls, sodass ein Anruf auch dann zustande kommt, wenn ein Teilnehmer dahinter sitzt. Einschalten mit der Aktion **Anrufweiterleitung konfigurieren**; erforderlich sind das in Mattermost installierte Calls-Plugin und ein laufendes Coturn mit eigener öffentlicher Domain. Solange sie aktiv ist, gehört das Feld „ICE Servers Configurations“ von Calls diesem Paket; beim Ausschalten wird es wieder geleert.`,
    pl_PL: `Nowa opcjonalna zależność **Coturn** przekazuje połączenia Mattermost przez NAT i restrykcyjne zapory, dzięki czemu połączenie zestawia się nawet wtedy, gdy uczestnik jest za nimi. Włącz ją akcją **Konfiguruj przekazywanie połączeń**; wymaga zainstalowanej w Mattermost wtyczki Calls oraz działającego Coturn z własną domeną publiczną. Dopóki jest włączona, ten pakiet jest właścicielem pola „ICE Servers Configurations” wtyczki Calls; wyłączenie jej czyści to pole.`,
    fr_FR: `La nouvelle dépendance optionnelle **Coturn** relaie les appels Mattermost à travers le NAT et les pare-feu restrictifs, de sorte qu'un appel aboutit même lorsqu'un participant se trouve derrière l'un d'eux. Activez-la avec l'action **Configurer le relais des appels** ; elle nécessite le plugin Calls installé dans Mattermost et un Coturn démarré avec un domaine public qui lui est propre. Tant qu'elle est active, ce paquet est propriétaire du champ « ICE Servers Configurations » de Calls ; la désactiver le vide à nouveau.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
