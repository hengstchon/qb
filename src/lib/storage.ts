import { atom } from 'jotai'
import { RESET } from 'jotai/utils'
import { KEY_PREFIX } from './constants'

type ValueType = boolean | number | string | object

export const setItem = (key: string, value: ValueType) => {
  localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
}

export const getItem = (key: string) => {
  const v = localStorage.getItem(KEY_PREFIX + key)
  return v ? JSON.parse(v) : null
}

export const removeItem = (key: string) => {
  localStorage.removeItem(KEY_PREFIX + key)
}

export const atomWithLocalStorage = <Value>(
  key: string,
  initialValue: Value
) => {
  const baseAtom = atom((getItem(key) ?? initialValue) as Value)
  return atom(
    (get) => get(baseAtom),
    (get, set, update: Value | typeof RESET | ((prev: Value) => Value)) => {
      const nextValue =
        typeof update === 'function'
          ? (update as (prev: Value) => Value | typeof RESET)(get(baseAtom))
          : update
      if (nextValue === RESET) {
        set(baseAtom, initialValue)
        return removeItem(key)
      }
      set(baseAtom, nextValue)
      return setItem(key, nextValue as ValueType)
    }
  )
}
