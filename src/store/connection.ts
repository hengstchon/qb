import { atom } from 'jotai'
import type { QbConnectionInfo } from '@/domain/capabilities'

export const connectionInfoAtom = atom<QbConnectionInfo | null>(null)
export const authCheckedAtom = atom(false)
export const authErrorAtom = atom<string | null>(null)
