import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { themeAtom } from '@/store'

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom)

  const toggleMode = useCallback(() => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, toggleMode }
}
