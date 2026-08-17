import { setupManifest } from '@start9labs/start-sdk'
import { coturnDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'mattermost',
  title: 'Mattermost',
  license: 'other',
  packageRepo: 'https://github.com/Start9Labs/mattermost-startos',
  upstreamRepo: 'https://github.com/mattermost/mattermost',
  marketingUrl: 'https://mattermost.com/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'mattermost', 'db'],
  images: {
    mattermost: {
      source: {
        dockerTag: 'mattermost/mattermost-team-edition:11.10.0',
      },
      arch: ['x86_64'],
    },
    postgres: {
      source: {
        dockerTag: 'postgres:16-alpine',
      },
      arch: ['x86_64'],
    },
  },
  dependencies: {
    coturn: {
      description: coturnDescription,
      optional: true,
      metadata: {
        title: 'Coturn',
        icon: 'https://raw.githubusercontent.com/Start9Labs/coturn-startos/d67ecaca5800a87e3300ce44c62484888f35d51b/icon.svg',
      },
    },
  },
})
