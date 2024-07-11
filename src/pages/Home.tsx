import { useAtom } from 'jotai'
import Details from '@/components/home/Details'
import Sidebar from '@/components/home/Sidebar'
import SidebarResizer from '@/components/home/SidebarResizer'
import StatusBar from '@/components/home/StatusBar'
import Toolbar from '@/components/home/Toolbar'
import Torrents from '@/components/home/Torrents'
import { useSyncMainData } from '@/hooks'
import { openSidebarAtom } from '@/store'

const HomePage = () => {
  useSyncMainData()
  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {isOpened && (
          <>
            <Sidebar />
            <SidebarResizer />
          </>
        )}

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
