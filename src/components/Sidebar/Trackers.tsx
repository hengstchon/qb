import { useAtom } from 'jotai'
import { torrentsAtom, trackersAtom } from '@/components/Homepage/atoms'
import { openTrackersAtom } from './atoms'
import { BaseCollapsible } from './Base'

const Trackers = () => {
  const [openTrackers, setOpenTrackers] = useAtom(openTrackersAtom)
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

  return (
    <BaseCollapsible
      title="Trackers"
      open={openTrackers}
      setOpen={setOpenTrackers}
      itemList={['All', 'Trackerless', ...Object.keys(trackers)]}
      getNum={getNumByTracker}
    />
  )
}

export default Trackers
