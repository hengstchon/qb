import { useAtom } from 'jotai'
import { sidebarWidthAtom } from '@/store/sidebarResizer'
import { ScrollArea } from '@/ui/ScrollArea'
import Categories from './Category'
import Status from './Status'
import Tags from './Tag'
import Trackers from './Tracker'

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
