export const isSuccessfulLoginResponse = (response: string | undefined) =>
  response === 'Ok.' || response === undefined

export const loginErrorMessage = (status?: number) => {
  if (status === 401) return 'The username or password is incorrect.'
  if (status === 403) {
    return 'Login is temporarily blocked for this address. Wait before retrying.'
  }
  return 'Unable to reach qBittorrent. Check the server and proxy.'
}
