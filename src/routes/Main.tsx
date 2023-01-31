import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { Button } from '@/ui/Button'
import axi from '@/utils/axi'
import { useSetAtom } from 'jotai'
import { isAuthedAtom } from './Auth'

const MainPage = () => {
  const { data } = useSWR('/app/version')
  const setIsAuthed = useSetAtom(isAuthedAtom)
  console.log(data)

  return (
    <div className="">
      <div>App version: {data}</div>
      <Link to="/login">Login</Link>
      <br />
      <Button
        className=""
        onClick={async () => {
          const res = await axi.post('/auth/logout')
          if (res.status == 200) setIsAuthed(false)
        }}
      >
        Logout
      </Button>
    </div>
  )
}

export default MainPage
