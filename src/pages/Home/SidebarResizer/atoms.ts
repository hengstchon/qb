import { focusAtom } from 'jotai-optics'
import { settingsAtom } from '../atoms'

export const sidebarWidthAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('sidebarWidth'),
)
