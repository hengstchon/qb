import type { SyncData } from '@/types'

export const qb4MainDataFixture: SyncData = {
  rid: 1,
  full_update: true,
  torrents: {
    download: {
      name: 'qB 4 download',
      state: 'pausedDL',
      dlspeed: 0,
      upspeed: 0,
    },
    seed: {
      name: 'qB 4 seed',
      state: 'pausedUP',
      dlspeed: 0,
      upspeed: 0,
    },
  },
  categories: {},
  tags: [],
  trackers: {},
  server_state: { connection_status: 'connected' },
}
