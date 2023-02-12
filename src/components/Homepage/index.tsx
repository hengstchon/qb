import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import Torrents from '@/components/Torrents'
import { useAtom, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { API } from '@/utils/api'
import { useEffect } from 'react'
import { refreshIntervalAtom, ridAtom, updateDataAtom } from './atoms'
import StatusBar from '../StatusBar'
import { openSidebarAtom } from '../Sidebar/atoms'
import Details from '../Details'
import SidebarDndContext from '../Sidebar/SidebarDndContext'

const HomePage = () => {
  const [rid, setRid] = useAtom(ridAtom)
  const [refreshInterval] = useAtom(refreshIntervalAtom)
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

  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="relative flex flex-1 overflow-hidden">
        <SidebarDndContext>{isOpened && <Sidebar />}</SidebarDndContext>

        <div className="flex min-w-0 flex-1 flex-col">
          <Torrents />
          <Details />
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default HomePage
