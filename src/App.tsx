import { SWRConfig } from 'swr'
import './index.css'
import { swrConfig } from '@/config/swrConfig'
import { useAuth } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Login from '@/pages/Login'

const App = () => {
  const { isAuthed } = useAuth()

  return (
    <SWRConfig value={swrConfig}>{isAuthed ? <Home /> : <Login />}</SWRConfig>
  )
}

export default App
