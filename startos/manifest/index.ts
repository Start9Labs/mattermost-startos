import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'mattermost',
  title: 'Mattermost',
  license: 'other',
  packageRepo: 'https://github.com/Start9Labs/mattermost-startos',
  upstreamRepo: 'https://github.com/mattermost/mattermost',
  marketingUrl: 'https://mattermost.com/',
  docsUrls: ['https://docs.mattermost.com/'],
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'mattermost', 'db'],
  images: {
    mattermost: {
      source: {
        dockerTag: 'mattermost/mattermost-team-edition:11.9.0',
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
  dependencies: {},
})
