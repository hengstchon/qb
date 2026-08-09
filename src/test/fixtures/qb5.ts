import type { SyncData } from '@/types'

export const qb5MainDataFixture: SyncData = {
  rid: 1,
  full_update: true,
  torrents: {
    download: {
      name: 'qB 5 download',
      state: 'stoppedDL',
      dlspeed: 0,
      upspeed: 0,
    },
    seed: {
      name: 'qB 5 seed',
      state: 'stoppedUP',
      dlspeed: 0,
      upspeed: 0,
    },
  },
  categories: {},
  tags: [],
  trackers: {},
  server_state: { connection_status: 'connected' },
}
