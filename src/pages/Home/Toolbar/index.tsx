import { Button } from '@/ui/Button'
import { LogOutIcon, SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'
import { useAtom, useSetAtom } from 'jotai'
import { API } from '@/api/endpoints'
import FilterInput from './FilterInput'
import {
  isAuthedAtom,
  mainRidAtom,
  refreshIntervalAtom,
} from '@/pages/Home/atoms'
import { openSidebarAtom } from '@/pages/Home/Sidebar/atoms'
import client from '@/api/client'
import { peersRidAtom } from '../Details/Peers/atoms'
import { RESET } from 'jotai/utils'

const Toolbar = () => {
  const setIsAuthed = useSetAtom(isAuthedAtom)
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom)
  const [refreshInterval, setRefreshInterval] = useAtom(refreshIntervalAtom)

  const setMainRid = useSetAtom(mainRidAtom)
  const setPeersRid = useSetAtom(peersRidAtom)

  return (
    <div className="flex h-12 items-center bg-red-50 px-2">
      <Button onClick={() => setOpenSidebar((v) => !v)}>
        {openSidebar ? (
          <SidebarCloseIcon className="h-6 w-6" />
        ) : (
          <SidebarOpenIcon className="h-6 w-6" />
        )}
      </Button>
      <Button
        className=""
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
      <select
        value={refreshInterval}
        onChange={(e) => {
          setRefreshInterval(Number(e.target.value))
        }}
      >
        {[1000, 3000, 5000, 10000000].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
      <Button
        className="ml-2 border"
        onClick={() => {
          // setMainRid((prev) => prev + 1)
          setPeersRid((prev) => prev + 1)
        }}
      >
        render
      </Button>
    </div>
  )
}

export default Toolbar
