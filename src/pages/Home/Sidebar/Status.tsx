import { Torrent } from '@/lib/types'
import { useAtom } from 'jotai'
import { torrentsAtom } from '../atoms'
import { openSideStatusAtom } from './atoms'
import { BaseCollapsible } from './Base'

const filterStatusMap: Record<string, (t: Torrent) => boolean> = {
  all: () => true,
  downloading: (t: Torrent) =>
    t.state === 'downloading' || t.state.indexOf('DL') !== -1,
  seeding: (t: Torrent) =>
    ['uploading', 'forcedUP', 'stalledUP', 'queuedUP', 'checkingUP'].includes(
      t.state
    ),
  completed: (t: Torrent) =>
    t.state === 'uploading' || t.state.indexOf('UP') !== -1,
  resumed: (t: Torrent) => t.state.indexOf('paused') === -1,
  paused: (t: Torrent) => t.state.indexOf('paused') !== -1,
  active: (t: Torrent) =>
    t.state === 'stalledDL'
      ? t.upspeed > 0
      : [
          'metaDL',
          'forcedMetaDL',
          'downloading',
          'forcedDL',
          'uploading',
          'forcedUP',
        ].includes(t.state),
  inactive: (t: Torrent) =>
    t.state === 'stalledDL'
      ? t.upspeed === 0
      : ![
          'metaDL',
          'forcedMetaDL',
          'downloading',
          'forcedDL',
          'uploading',
          'forcedUP',
        ].includes(t.state),
  stalled: (t: Torrent) => t.state === 'stalledUP' || t.state === 'stalledDL',
  stalled_uploading: (t: Torrent) => t.state === 'stalledUP',
  stalled_downloading: (t: Torrent) => t.state === 'stalledDL',
  checking: (t: Torrent) =>
    ['checkingUP', 'checkingDL', 'checkingResumeData'].includes(t.state),
  errored: (t: Torrent) =>
    ['error', 'unknown', 'missingFiles'].includes(t.state),
}

const statusList = [
  'all',
  'downloading',
  'seeding',
  'completed',
  'resumed',
  'paused',
  'active',
  'inactive',
  'stalled',
  'stalled uploading',
  'stalled downloading',
  'checking',
  'errored',
]

const Status = () => {
  const [openStatus, setOpenStatus] = useAtom(openSideStatusAtom)
  const [torrents] = useAtom(torrentsAtom)

  const getNumByStatus = (status: string) =>
    Object.values(torrents).filter(
      filterStatusMap[status.toLowerCase().replace(' ', '_')]
    ).length

  return (
    <BaseCollapsible
      title="Status"
      open={openStatus}
      setOpen={setOpenStatus}
      itemList={statusList}
      getNum={getNumByStatus}
    />
  )
}

export default Status
