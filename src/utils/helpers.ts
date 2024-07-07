import { cx } from 'class-variance-authority'
import { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(cx(inputs))
}

export const getRound = (n: number, d = 1) => parseFloat(n.toFixed(d))

export function getStatusValue(state: string) {
  let status
  switch (state) {
    case 'downloading':
      status = 'Downloading'
      break
    case 'stalledDL':
      status = 'Stalled'
      break
    case 'metaDL':
      status = 'Downloading metadata'
      break
    case 'forcedMetaDL':
      status = '[F] Downloading metadata'
      break
    case 'forcedDL':
      status = '[F] Downloading'
      break
    case 'uploading':
    case 'stalledUP':
      status = 'Seeding'
      break
    case 'forcedUP':
      status = '[F] Seeding'
      break
    case 'queuedDL':
    case 'queuedUP':
      status = 'Queued'
      break
    case 'checkingDL':
    case 'checkingUP':
      status = 'Checking'
      break
    case 'queuedForChecking':
      status = 'Queued for checking'
      break
    case 'checkingResumeData':
      status = 'Checking resume data'
      break
    case 'pausedDL':
      status = 'Paused'
      break
    case 'pausedUP':
      status = 'Completed'
      break
    case 'moving':
      status = 'Moving'
      break
    case 'missingFiles':
      status = 'Missing Files'
      break
    case 'error':
      status = 'Errored'
      break
    default:
      status = 'Unknown'
  }
  return status
}
