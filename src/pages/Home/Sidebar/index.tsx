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
    <ScrollArea
      className="h-full px-2 py-4 [&>div>div]:!block"
      style={{ width: width + 'px' }}
    >
      <Status />
      <Categories />
      <Tags />
      <Trackers />
    </ScrollArea>
  )
}

export default Sidebar
