import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import Torrents from '@/components/Torrents'
import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/utils/api'
import { useEffect } from 'react'
import {
  refreshIntervalAtom,
  ridAtom,
  torrentsAtom,
  updateDataAtom,
} from './atoms'
import StatusBar from '../StatusBar'
import { openSidebarAtom } from '../Sidebar/atoms'
import SidebarDndContext from '../Sidebar/SidebarDndContext'

const HomePage = () => {
  const [rid, setRid] = useAtom(ridAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
  const [torrents] = useAtom(torrentsAtom)
  const setUpdateDataAtom = useSetAtom(updateDataAtom)

  const { data } = useSWRImmutable(API.syncMain(rid), {
    onSuccess: (data) => {
      setUpdateDataAtom(data)
    },
  })

  useEffect(() => {
    if (!data?.rid) return
    const pollingInterval = refreshInterval
    const id = setTimeout(() => {
      setRid(data.rid)
    }, pollingInterval)
    return () => clearTimeout(id)
  }, [data, refreshInterval])

  // console.log(`torrents: ${new Date().toLocaleTimeString()}`, torrents)

  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="relative flex flex-1 overflow-hidden">
        <SidebarDndContext>{isOpened && <Sidebar />}</SidebarDndContext>

        {Object.values(torrents).length && (
          <Torrents torrents={Object.values(torrents)} />
        )}
      </div>
      <StatusBar />
    </div>
  )
}

export default HomePage
