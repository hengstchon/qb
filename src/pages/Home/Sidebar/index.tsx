import { useAtom } from 'jotai'
import { ScrollArea } from '@/ui/ScrollArea'
import { sidebarWidthAtom } from '../SidebarResizer/atoms'
import Categories from './Categories'
import Status from './Status'
import Tags from './Tags'
import Trackers from './Trackers'

const Sidebar = () => {
  const [width] = useAtom(sidebarWidthAtom)

  return (
    <div className="flex flex-none" style={{ width: width + 'px' }}>
      <ScrollArea className="h-full px-1">
        {/* <div className={'flex h-full w-full flex-col gap-2 p-4'}> */}
        <Status />
        <Categories />
        <Tags />
        <Trackers />
        {/* </div> */}
      </ScrollArea>
    </div>
  )
}

export default Sidebar
