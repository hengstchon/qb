import type { ApiQuery, ApiRequest } from './client'

const request = (endpoint: string, query?: ApiQuery): ApiRequest => ({
  endpoint,
  query,
})

export const API = {
  login: '/auth/login',
  logout: '/auth/logout',
  version: '/app/version',
  webapiVersion: '/app/webapiVersion',
  buildInfo: '/app/buildInfo',
  clientData: {
    load: (keys: string[]) =>
      request('/clientdata/load', { keys: JSON.stringify(keys) }),
    store: '/clientdata/store',
  },
  sync: {
    maindata: (rid = 0) => request('/sync/maindata', { rid }),
    torrentPeers: (hash: string, rid = 0) =>
      request('/sync/torrentPeers', { rid, hash }),
  },
  torrents: {
    info: () => request('/torrents/info'),
    properties: (hash: string) => request('/torrents/properties', { hash }),
    trackers: (hash: string) => request('/torrents/trackers', { hash }),
    webseeds: (hash: string) => request('/torrents/webseeds', { hash }),
    files: (hash: string) => request('/torrents/files', { hash }),
    pieceStates: (hash: string) => request('/torrents/pieceStates', { hash }),
    pieceHashes: (hash: string) => request('/torrents/pieceHashes', { hash }),
    categories: request('/torrents/categories'),
    fetchMetadata: '/torrents/fetchMetadata',
    parseMetadata: '/torrents/parseMetadata',
    saveMetadata: '/torrents/saveMetadata',
    addTorrents: '/torrents/add',
    deleteTorrents: '/torrents/delete',
  },
}
