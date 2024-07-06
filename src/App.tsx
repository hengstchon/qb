import { useAtom } from 'jotai'
import { SWRConfig, SWRConfiguration } from 'swr'
import './index.css'
import AbortAddon from 'wretch/addons/abort'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import { client } from '@/services'
import { isAuthedAtom } from '@/store'

const App = () => {
  const [isAuthed, setIsAuthed] = useAtom(isAuthedAtom)

  const swrConfig: SWRConfiguration = {
    fetcher: (url) =>
      client
        .addon(AbortAddon())
        .get(url)
        .setTimeout(5000)
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
