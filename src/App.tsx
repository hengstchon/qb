import { SWRConfig } from 'swr'
import './index.css'
import { useAuth } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import { useSwrConfig } from './hooks/useSwrConfig'

const App = () => {
  const { isAuthed } = useAuth()
  const { swrConfig } = useSwrConfig()

  return (
    <SWRConfig value={swrConfig}>{isAuthed ? <Home /> : <Login />}</SWRConfig>
  )
}

export default App
