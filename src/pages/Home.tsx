import { useAtom } from 'jotai'
import Details from '@/components/home/Details'
import Sidebar from '@/components/home/Sidebar'
import StatusBar from '@/components/home/StatusBar'
import Toolbar from '@/components/home/Toolbar'
import Torrents from '@/components/home/Torrents'
import { useClientDataSync, useSyncMainData } from '@/hooks'
import { openSidebarAtom } from '@/store'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'

const HomePage = () => {
  useSyncMainData()
  useClientDataSync()
  const [isOpened] = useAtom(openSidebarAtom)

  return (
    <div className="flex h-screen flex-col">
      <Toolbar />

      <ResizablePanelGroup orientation="horizontal" id="main">
        {isOpened && (
          <>
            <ResizablePanel id="sidebar" minSize="5%" defaultSize="15%">
              <Sidebar />
            </ResizablePanel>

            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel id="content" className="flex flex-col" minSize="5%">
          <Torrents />
          <Details />
        </ResizablePanel>
      </ResizablePanelGroup>

      <StatusBar />
    </div>
  )
}

export default HomePage
