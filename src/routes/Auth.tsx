import { Navigate, Outlet } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const isAuthedAtom = atomWithStorage('isAuthed', false)

const Auth = () => {
  const isAuthed = useAtomValue(isAuthedAtom)

  return isAuthed ? <Outlet /> : <Navigate to="/login" />
}

export default Auth
