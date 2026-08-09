import { SWRConfig } from 'swr'
import './index.css'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { ThemeProvider } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import { authCheckedAtom } from '@/store'
import { useSwrConfig } from './hooks/useSwrConfig'

const App = () => {
  const { isAuthed, checkAuth } = useAuth()
  const authChecked = useAtomValue(authCheckedAtom)
  const { swrConfig } = useSwrConfig()

  useEffect(() => {
    void checkAuth()
  }, [])

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        Connecting…
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <SWRConfig value={swrConfig}>{isAuthed ? <Home /> : <Login />}</SWRConfig>
    </ThemeProvider>
  )
}

export default App
