export const API = {
  login: '/auth/login',
  logout: '/auth/logout',
  sync: {
    maindata: (rid = 0) => `/sync/maindata?rid=${rid}`,
    torrentPeers: (hash: string, rid = 0) =>
      `/sync/torrentPeers?rid=${rid}&hash=${hash}`,
  },
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
