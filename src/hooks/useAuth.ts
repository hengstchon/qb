import { useAtom } from 'jotai'
import { API, client } from '@/services'
import { authAtom } from '@/store'

export const useAuth = () => {
  const [isAuthed, setIsAuthed] = useAtom(authAtom)

  const checkAuth = async () => {
    try {
      await client.get(API.version).res()
      setIsAuthed(true)
    } catch (error) {
      setIsAuthed(false)
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
      const res = await client
        .url(API.login)
        .headers({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        })
        .post(`username=${username}&password=${password}`)
        .text()
      if (res == 'Ok.') {
        setIsAuthed(true)
      } else if (res == 'Fails.') {
        console.log('Wrong username or password!')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      await client.url(API.logout).post().res()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsAuthed(false)
    }
  }

  return { isAuthed, checkAuth, login, logout }
}
