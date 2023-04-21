import { Navigate, Outlet } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { isAuthedAtom } from '@/pages/Home/atoms'

const Auth = () => {
  const isAuthed = useAtomValue(isAuthedAtom)

  return isAuthed ? <Outlet /> : <Navigate to="/login" />
}

export default Auth
