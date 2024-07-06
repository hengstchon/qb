import { useAtom } from 'jotai'
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from 'lucide-react'
import { serverStateAtom } from '@/store'
import { formatBytes, formatSpeed } from '@/utils'

const StatusBar = () => {
  const [serverState] = useAtom(serverStateAtom)
  const {
    free_space_on_disk,
    dl_info_speed,
    dl_info_data,
    up_info_speed,
    up_info_data,
  } = serverState

  return (
    <div className="flex h-8 items-center justify-end gap-8 border-t px-2 text-sm">
      <span>Free space: {formatBytes(free_space_on_disk)}</span>
      <span className="flex items-center gap-1">
        <ArrowDownCircleIcon className="h-4 w-4" />
        {`${formatSpeed(dl_info_speed)} (${formatBytes(dl_info_data)})`}
      </span>
      <span className="flex items-center gap-1">
        <ArrowUpCircleIcon className="h-4 w-4" />
        {`${formatSpeed(up_info_speed)} (${formatBytes(up_info_data)})`}
      </span>
    </div>
  )
}

export default StatusBar
