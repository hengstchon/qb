import { useAtom } from 'jotai'
import { SWRConfig, SWRConfiguration } from 'swr'
import './index.css'
import AbortAddon from 'wretch/addons/abort'
import client from '@/api/client'
import Home from '@/pages/Home'
import { isAuthedAtom } from '@/pages/Home/atoms'
import { Login } from '@/pages/Login'

const App = () => {
  const [isAuthed, setIsAuthed] = useAtom(isAuthedAtom)

  const swrConfig: SWRConfiguration = {
    fetcher: (url) =>
      client
        .addon(AbortAddon())
        .get(url)
        .setTimeout(2000)
        .json((res) => res),
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
