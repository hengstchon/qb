import { useAtom } from 'jotai'
import { isSuccessfulLoginResponse, loginErrorMessage } from '@/domain/auth'
import { API, detectQbittorrent, qbApi, QbApiError } from '@/services'
import {
  authAtom,
  authCheckedAtom,
  authErrorAtom,
  connectionInfoAtom,
} from '@/store'

export const useAuth = () => {
  const [isAuthed, setIsAuthed] = useAtom(authAtom)
  const [, setAuthChecked] = useAtom(authCheckedAtom)
  const [, setAuthError] = useAtom(authErrorAtom)
  const [, setConnectionInfo] = useAtom(connectionInfoAtom)

  const finishAuthentication = async () => {
    const connectionInfo = await detectQbittorrent()
    setConnectionInfo(connectionInfo)
    setAuthError(null)
    setIsAuthed(true)
  }

  const checkAuth = async () => {
    try {
      await finishAuthentication()
    } catch (error) {
      setConnectionInfo(null)
      setIsAuthed(false)
      setAuthError(
        error instanceof QbApiError && [401, 403].includes(error.status ?? 0)
          ? null
          : 'Unable to detect the qBittorrent and WebAPI versions. Sign in to retry.',
      )
    } finally {
      setAuthChecked(true)
    }
  }

  const login = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    setAuthError(null)

    let response: string | undefined
    try {
      response = await qbApi.postForm<string>(
        API.login,
        { username, password },
        'text',
      )
    } catch (error) {
      setConnectionInfo(null)
      setIsAuthed(false)
      setAuthChecked(true)
      setAuthError(
        loginErrorMessage(
          error instanceof QbApiError ? error.status : undefined,
        ),
      )
      return
    }

    if (!isSuccessfulLoginResponse(response)) {
      setIsAuthed(false)
      setAuthChecked(true)
      setAuthError('The username or password is incorrect.')
      return
    }

    try {
      await finishAuthentication()
    } catch {
      setConnectionInfo(null)
      setIsAuthed(false)
      setAuthError(
        'Login succeeded, but qBittorrent version detection failed. Please retry.',
      )
    } finally {
      setAuthChecked(true)
    }
  }

  const logout = async () => {
    try {
      await qbApi.postForm(API.logout, {})
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setConnectionInfo(null)
      setAuthError(null)
      setIsAuthed(false)
    }
  }

  return { isAuthed, setIsAuthed, checkAuth, login, logout }
}
