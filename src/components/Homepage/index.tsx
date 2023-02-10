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
import { useDrag, useDrop } from 'react-dnd'
import { sidebarWidthAtom } from '../Sidebar/atoms'

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

  const setSidebarWidth = useSetAtom(sidebarWidthAtom)

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    type: 'sidebar',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: 'sidebar',
    drop: (item, monitor) => {
      setSidebarWidth(monitor.getClientOffset().x)
    },
  })

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="relative flex flex-1 overflow-hidden" ref={dropRef}>
        <Sidebar />
        <div
          className="h-full w-1 bg-gray-50 hover:cursor-col-resize hover:bg-gray-500"
          ref={dragRef}
        ></div>

        {/* {Math.random()} */}
        {Object.values(torrents).length && (
          <Torrents torrents={Object.values(torrents)} />
        )}
      </div>
      <StatusBar />
    </div>
  )
}

export default HomePage
