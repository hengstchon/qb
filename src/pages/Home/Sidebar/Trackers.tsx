import { useAtom } from 'jotai'
import { torrentsAtom, trackersAtom } from '../atoms'
import { openSideTrackersAtom } from './atoms'
import { List, ListItem } from './BaseList'

const Trackers = () => {
  const [openTrackers, setOpenTrackers] = useAtom(openSideTrackersAtom)
  const [trackers] = useAtom(trackersAtom)
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

  const trackersList = ['All', 'Trackerless', ...Object.keys(trackers)]

  return (
    <List title="Trackers" open={openTrackers} setOpen={setOpenTrackers}>
      {trackersList.map((tracker) => {
        return (
          <ListItem key={tracker}>
            <span className="truncate">{tracker}</span>
            <span>({getNumByTracker(tracker)})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Trackers
