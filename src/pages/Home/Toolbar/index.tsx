import { Button } from '@/ui/Button'
import {
  LogOutIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  Trash2,
} from 'lucide-react'
import { useAtom, useSetAtom } from 'jotai'
import { API } from '@/api/endpoints'
import FilterInput from './FilterInput'
import { isAuthedAtom, refreshIntervalAtom } from '@/pages/Home/atoms'
import { openSidebarAtom } from '@/pages/Home/Sidebar/atoms'
import client from '@/api/client'
import { RESET } from 'jotai/utils'
import { AddTorrent } from './AddTorrent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'
import DeleteTorrent from './DeleteTorrent'

const Toolbar = () => {
  const setIsAuthed = useSetAtom(isAuthedAtom)
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom)
  const [refreshInterval, setRefreshInterval] = useAtom(refreshIntervalAtom)

  return (
    <div className="flex h-12 items-center bg-red-50 p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpenSidebar((v) => !v)}
      >
        {openSidebar ? (
          <SidebarCloseIcon className="h-6 w-6" />
        ) : (
          <SidebarOpenIcon className="h-6 w-6" />
        )}
      </Button>

      <AddTorrent />

      <DeleteTorrent />

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

      <FilterInput />

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
    </div>
  )
}

export default Toolbar
