import { useAtom } from 'jotai'
import { Torrent } from '@/lib/types'
import { torrentsAtom } from '../atoms'
import { openSideStatusAtom } from './atoms'
import { List, ListItem } from './BaseList'

const filterStatusMap: Record<string, (t: Torrent) => boolean> = {
  all: () => true,
  downloading: (t: Torrent) =>
    t.state === 'downloading' || t.state.indexOf('DL') !== -1,
  seeding: (t: Torrent) =>
    ['uploading', 'forcedUP', 'stalledUP', 'queuedUP', 'checkingUP'].includes(
      t.state,
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

type StatusType = {
  name: string
  filterValue: string | null
  filterFn: (t: Torrent) => boolean
}
const statusList: StatusType[] = [
  {
    name: 'all',
    filterValue: null,
    filterFn: () => true,
  },
  {
    name: 'downloading',
    filterValue: 'downloading',
    filterFn: (t: Torrent) =>
      t.state === 'downloading' || t.state.indexOf('DL') !== -1,
  },
  {
    name: 'seeding',
    filterValue: 'seeding',
    filterFn: (t: Torrent) =>
      ['uploading', 'forcedUP', 'stalledUP', 'queuedUP', 'checkingUP'].includes(
        t.state,
      ),
  },
  {
    name: 'completed',
    filterValue: 'completed',
    filterFn: (t: Torrent) =>
      t.state === 'uploading' || t.state.indexOf('UP') !== -1,
  },
  {
    name: 'resumed',
    filterValue: 'resumed',
    filterFn: (t: Torrent) => t.state.indexOf('paused') === -1,
  },
  {
    name: 'paused',
    filterValue: 'paused',
    filterFn: (t: Torrent) => t.state.indexOf('paused') !== -1,
  },
  {
    name: 'active',
    filterValue: 'active',
    filterFn: (t: Torrent) =>
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
  },
  {
    name: 'inactive',
    filterValue: 'inactive',
    filterFn: (t: Torrent) =>
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
  },
  {
    name: 'stalled',
    filterValue: 'stalled',
    filterFn: (t: Torrent) =>
      t.state === 'stalledUP' || t.state === 'stalledDL',
  },
  {
    name: 'stalled uploading',
    filterValue: 'stalled_uploading',
    filterFn: (t: Torrent) => t.state === 'stalledUP',
  },
  {
    name: 'stalled downloading',
    filterValue: 'stalled_downloading',
    filterFn: (t: Torrent) => t.state === 'stalledDL',
  },
  {
    name: 'checking',
    filterValue: 'checking',
    filterFn: (t: Torrent) =>
      ['checkingUP', 'checkingDL', 'checkingResumeData'].includes(t.state),
  },
  {
    name: 'errored',
    filterValue: 'errored',
    filterFn: (t: Torrent) =>
      ['error', 'unknown', 'missingFiles'].includes(t.state),
  },
]

const Status = () => {
  const [openStatus, setOpenStatus] = useAtom(openSideStatusAtom)
  const [torrents] = useAtom(torrentsAtom)

  const getNumByStatus = (status: string) =>
    Object.values(torrents).filter(
      filterStatusMap[status.toLowerCase().replace(' ', '_')],
    ).length

  return (
    <List title="Status" open={openStatus} setOpen={setOpenStatus}>
      {statusList.map(({ name, filterValue, filterFn }) => {
        return (
          <ListItem key={name}>
            <span className="truncate">{name}</span>
            <span>({Object.values(torrents).filter(filterFn).length})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Status
