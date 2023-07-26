import { cx } from 'class-variance-authority'
import { ClassValue } from 'class-variance-authority/dist/types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(cx(inputs))
}

export const formatBytes = (bytes: number, dp?: number) => {
  if (bytes == 0) return '0 B'
  const k = 1024,
    units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
    dps = [0, 1, 1, 2, 3, 3, 3, 3, 3],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(dp || dps[i]) + ' ' + units[i]
}

export const formatSpeed = (bytes: number, dp?: number) =>
  `${formatBytes(bytes, dp)}/s`

export const formatPercentage = (data: number) =>
  `${Math.round(data * 10000) / 100}% `

export const getRound = (n: number, d = 1) => parseFloat(n.toFixed(d))

dayjs.extend(duration)
dayjs.extend(relativeTime)
export function formatTimestamp(timestamp: number | null) {
  return timestamp == null || timestamp === -1
    ? ''
    : dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

export const formatDuration = (seconds: number, maxCap = -1) => {
  if (seconds < 0 || (seconds >= maxCap && maxCap >= 0)) return '∞'
  if (seconds == 0) return '0'
  const d = dayjs.duration(seconds, 's')
  if (d.years() > 0) return `${d.years()}y ${d.days()}d`
  if (d.days() > 0) return `${d.days()}d ${d.hours()}h`
  if (d.hours() > 0) return `${d.hours()}h ${d.minutes()}m`
  if (d.minutes() > 1 && d.minutes() < 60) return `${d.minutes()}m`
  return '< 1m'
}
