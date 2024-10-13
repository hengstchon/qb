import { ScrollArea } from '@/ui/ScrollArea'
import { Separator } from '@/ui/Separator'
import Categories from './Category'
import Status from './Status'
import Tags from './Tag'
import Trackers from './Tracker'

const Sidebar = () => {
  return (
    <ScrollArea className="h-full">
      <Status />

      <Separator />

      <Categories />

      <Separator />

      <Tags />

      <Separator />

      <Trackers />
    </ScrollArea>
  )
}

export default Sidebar
