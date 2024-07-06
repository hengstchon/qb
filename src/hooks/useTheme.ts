import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { themeModeAtom } from '@/store'

export const useTheme = () => {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom)
  const isDark = themeMode === 'dark'

  const toggleMode = useCallback(() => {
    if (isDark) {
      setThemeMode('light')
    } else {
      setThemeMode('dark')
    }
  }, [isDark])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return { isDark, toggleMode }
}
