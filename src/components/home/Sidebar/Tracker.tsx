import { useAtom } from 'jotai'
import { FIX_TRACKERS } from '@/config/constants'
import {
  openSideTrackersAtom,
  torrentsAtom,
  trackerFilterAtom,
  trackersAtom,
} from '@/store'
import { SideBlock, SideBlockItem } from './SideBlock'

const Trackers = () => {
  const [openTrackers, setOpenTrackers] = useAtom(openSideTrackersAtom)
  const [trackers] = useAtom(trackersAtom)
  const [currentFilter, setCurrentFilter] = useAtom(trackerFilterAtom)
  const [torrents] = useAtom(torrentsAtom)

  const getNumByTracker = (tracker: string) => {
    const torsArr = Object.values(torrents)
    if (tracker === 'All') {
      return torsArr.length
    } else if (tracker === 'Trackerless') {
      return torsArr.filter((t) => t.trackers_count === 0).length
    } else {
      return trackers[tracker].length
    }
  }

  const trackersList = [
    ...FIX_TRACKERS,
    ...Object.keys(trackers).map((t) => ({ name: t, filterValue: t })),
  ]

  return (
    <SideBlock title="Trackers" open={openTrackers} setOpen={setOpenTrackers}>
      {trackersList.map(({ name, filterValue }) => {
        return (
          <SideBlockItem
            key={name}
            selected={currentFilter === filterValue}
            onClick={() => {
              currentFilter !== filterValue && setCurrentFilter(filterValue)
            }}
          >
            <span className="truncate">{name}</span>
            <span>({getNumByTracker(name)})</span>
          </SideBlockItem>
        )
      })}
    </SideBlock>
  )
}

export default Trackers
