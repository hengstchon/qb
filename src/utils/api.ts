export const API = {
  login: '/auth/login',
  logout: '/auth/logout',
  syncMain: (rid = 0) => `/sync/maindata?rid=${rid}`,
  torrents: {
    info: () => `/torrents/info`,
    preperties: (hash: string) => `/torrents/properties?hash=${hash}`,
    trackers: (hash: string) => `/torrents/trackers?hash=${hash}`,
    webseeds: (hash: string) => `/torrents/webseeds?hash=${hash}`,
    files: (hash: string) => `/torrents/files?hash=${hash}`,
    pieceStates: (hash: string) => `/torrents/pieceStates?hash=${hash}`,
    pieceHashes: (hash: string) => `/torrents/pieceHashes?hash=${hash}`,
  },
}
