import { useAtom } from 'jotai'
import Details from '@/components/home/Details'
import Sidebar from '@/components/home/Sidebar'
import StatusBar from '@/components/home/StatusBar'
import Toolbar from '@/components/home/Toolbar'
import Torrents from '@/components/home/Torrents'
import { useSyncMainData } from '@/hooks'
import { openSidebarAtom } from '@/store'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'

const HomePage = () => {
  useSyncMainData()
  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />

      <ResizablePanelGroup direction="horizontal" autoSaveId="main">
        {isOpened && (
          <>
            <ResizablePanel order={1} minSize={5} defaultSize={15}>
              <Sidebar />
            </ResizablePanel>

            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel className="flex flex-col" order={2} minSize={5}>
          <Torrents />
          <Details />
        </ResizablePanel>
      </ResizablePanelGroup>

      <StatusBar />
    </div>
  )
}

export default HomePage
