import { SWRConfig } from 'swr'
import './index.css'
import { ThemeProvider } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import { useSwrConfig } from './hooks/useSwrConfig'

const App = () => {
  const { isAuthed } = useAuth()
  const { swrConfig } = useSwrConfig()

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <SWRConfig value={swrConfig}>{isAuthed ? <Home /> : <Login />}</SWRConfig>
    </ThemeProvider>
  )
}

export default App
