import { useAtom } from 'jotai'
import { API, detectQbittorrent, qbApi } from '@/services'
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
    } catch {
      setConnectionInfo(null)
      setIsAuthed(false)
      setAuthError(
        'Unable to detect the qBittorrent and WebAPI versions. Sign in to retry.',
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
    try {
      const res = await qbApi.postForm<string>(
        API.login,
        { username, password },
        'text',
      )
      if (res == 'Ok.') {
        await finishAuthentication()
      } else if (res == 'Fails.') {
        setAuthError('The username or password is incorrect.')
      }
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
      setIsAuthed(false)
    }
  }

  return { isAuthed, setIsAuthed, checkAuth, login, logout }
}
