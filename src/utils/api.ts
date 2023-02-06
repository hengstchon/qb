export const API = {
  login: '/auth/login',
  logout: '/auth/logout',
  torrentInfo: () => {
    return `/torrents/info`
  },
  syncMain: (rid = 0) => `/sync/maindata?rid=${rid}`,
}
