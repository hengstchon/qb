import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatBytes = (bytes: number, dp = 1) => {
  if (bytes == 0) return '0 B'
  const k = 1024,
    units = ['iB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(dp) + ' ' + units[i]
}

dayjs.extend(duration)
dayjs.extend(relativeTime)
export function formatTimestamp(timestamp: number | null) {
  return timestamp == null || timestamp === -1
    ? ''
    : dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

export const formatPercentage = (data: number) =>
  `${Math.round(data * 10000) / 100}%`
// i.toFixed(1).replace('100.0', '100')
