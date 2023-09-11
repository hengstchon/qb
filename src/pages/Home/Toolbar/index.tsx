import { useAtom, useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
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
import client from '@/api/client'
import { API } from '@/api/endpoints'
import { useTheme } from '@/hooks/useTheme'
import { isAuthedAtom, refreshIntervalAtom } from '@/pages/Home/atoms'
import { openSidebarAtom } from '@/pages/Home/Sidebar/atoms'
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
  const setIsAuthed = useSetAtom(isAuthedAtom)
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom)
  const [refreshInterval, setRefreshInterval] = useAtom(refreshIntervalAtom)
  const { isDark, toggleMode } = useTheme()

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
          onValueChange={(value) => {
            setRefreshInterval(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-32">
            <SelectValue>{refreshInterval}</SelectValue>
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
            toggleMode()
          }}
        >
          {isDark ? <Sun /> : <Moon />}
        </Button>

        <Button variant="ghost" size="sm">
          <Languages />
        </Button>

        <Button variant="ghost" size="sm">
          <Info />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            client
              .url(API.logout)
              .post()
              .res((res) => {
                if (res.status == 200) setIsAuthed(RESET)
              })
          }}
        >
          <LogOutIcon />
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
