import { AxiosError } from 'axios'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import useSWR from 'swr'

export const isAuthedAtom = atom(false)

const Auth = () => {
  const [isAuthed, setIsAuthed] = useAtom(isAuthedAtom)
  const { data, error } = useSWR<string, AxiosError>('/app/version')
  const navigate = useNavigate()
  console.log({ data })
  console.log({ error })

  useEffect(() => {
    if (error?.status == 403) {
      setIsAuthed(false)
    }
    if (data) setIsAuthed(true)
  }, [data, error])

  useEffect(() => {
    if (!isAuthed) navigate('/login')
  }, [isAuthed])

  if (isAuthed) return <Outlet />
}

export default Auth
