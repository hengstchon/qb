import { ScrollArea } from '@/ui/ScrollArea'
import Categories from './Category'
import Status from './Status'
import Tags from './Tag'
import Trackers from './Tracker'

const Sidebar = () => {
  return (
    <ScrollArea className="h-full px-2 py-4 [&>div>div]:!block">
      <Status />
      <Categories />
      <Tags />
      <Trackers />
    </ScrollArea>
  )
}

export default Sidebar
