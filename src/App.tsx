import { SWRConfig, SWRConfiguration } from 'swr'
import { useAtom } from 'jotai'
import './index.css'
import client from '@/api/client'
import { isAuthedAtom } from '@/pages/Home/atoms'
import Home from '@/pages/Home'
import { Login } from '@/pages/Login'

const App = () => {
  const [isAuthed, setIsAuthed] = useAtom(isAuthedAtom)

  const swrConfig: SWRConfiguration = {
    fetcher: (url) => client.get(url).json((res) => res),
    onError: (err) => {
      if (err.status == 403) {
        setIsAuthed(false)
      }
    },
  }

  return (
    <SWRConfig value={swrConfig}>{isAuthed ? <Home /> : <Login />}</SWRConfig>
  )
}

export default App
