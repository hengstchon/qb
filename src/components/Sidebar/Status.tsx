import { Torrent } from '@/types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/Collapsible'
import { useAtom } from 'jotai'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'
import { torrentsAtom } from '../Homepage/atoms'
import { openStatusAtom } from './atoms'

const filterMap: Record<string, (t: Torrent) => boolean> = {
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

const Item = ({ children }: { children: React.ReactElement[] }) => {
  return (
    <li>
      <button className="flex w-full justify-between rounded px-2 py-[2px] hover:bg-green-100">
        {children}
      </button>
    </li>
  )
}

const Status = () => {
  const [openStatus, setOpenStatus] = useAtom(openStatusAtom)
  const [torrents] = useAtom(torrentsAtom)

  const getNumByStatus = (status: string) =>
    Object.values(torrents).filter(
      filterMap[status.toLowerCase().replace(' ', '_')]
    ).length

  return (
    <div className="bg-green-50">
      <Collapsible open={openStatus} onOpenChange={setOpenStatus}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between gap-1 rounded border px-2">
          <span>Status</span>
          <ChevronDownIcon className="h-5 w-5 transform duration-300 ease-in-out group-data-[state=closed]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="flex flex-col p-2 text-sm">
            {statusList.map((status) => (
              <Item key={status}>
                <span className="capitalize">{status}</span>
                <span>({getNumByStatus(status)})</span>
              </Item>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default Status
