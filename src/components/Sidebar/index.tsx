import { useAtom } from 'jotai'
import { openSidebarAtom, sidebarWidthAtom } from './atoms'
import Categories from './Categories'
import Status from './Status'
import Tags from './Tags'
import Trackers from './Trackers'

const Sidebar = () => {
  const [isOpened] = useAtom(openSidebarAtom)
  const [width] = useAtom(sidebarWidthAtom)
  return (
    <div
      className={'flex flex-none flex-col gap-2 bg-blue-50 p-2'}
      style={{ width: isOpened ? width + 'px' : 0 }}
    >
      <Status />
      <Categories />
      <Tags />
      <Trackers />
    </div>
  )
}

export default Sidebar
