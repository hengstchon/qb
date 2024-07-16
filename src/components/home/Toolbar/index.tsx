import { useAtom } from 'jotai'
import {
  Info,
  Languages,
  LogOutIcon,
  Moon,
  Rss,
  Settings,
  SidebarClose,
  SidebarOpen,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { openSidebarAtom, refreshIntervalAtom } from '@/store'
import { Button } from '@/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'
import FilterInput from './FilterInput'

const Toolbar = () => {
  const { logout } = useAuth()
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom)
  const [refreshInterval, setRefreshInterval] = useAtom(refreshIntervalAtom)
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-12 items-center justify-between border-b bg-background p-2">
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenSidebar((v) => !v)}
        >
          {openSidebar ? (
            <SidebarClose className="h-6 w-6" />
          ) : (
            <SidebarOpen className="h-6 w-6" />
          )}
        </Button>

        <Button variant="ghost" size="sm">
          <Settings />
        </Button>

        <Button variant="ghost" size="sm">
          <Rss />
        </Button>
      </div>

      <FilterInput />

      <div className="flex">
        <Select
          value={String(refreshInterval)}
          onValueChange={(value) => {
            setRefreshInterval(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1000, 3000, 5000, 10000000].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>

        <Button variant="ghost" size="sm">
          <Languages />
        </Button>

        <Button variant="ghost" size="sm">
          <Info />
        </Button>

        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOutIcon />
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
