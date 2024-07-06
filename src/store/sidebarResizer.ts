import { focusAtom } from 'jotai-optics'
import { settingsAtom } from './global'

export const sidebarWidthAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop('sidebarWidth'),
)
