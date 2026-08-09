import { atom } from 'jotai'
import { RESET } from 'jotai/utils'
import { KEY_PREFIX } from '@/config/constants'

type ValueType = boolean | number | string | object

export const STORAGE_SCHEMA_VERSION = 1

type StorageEnvelope<Value> = {
  version: number
  value: Value
}

const storageKey = (key: string) => KEY_PREFIX + key

const mergeWithDefaults = <Value>(
  initialValue: Value,
  storedValue: unknown,
) => {
  if (
    initialValue !== null &&
    storedValue !== null &&
    typeof initialValue === 'object' &&
    typeof storedValue === 'object' &&
    !Array.isArray(initialValue) &&
    !Array.isArray(storedValue)
  ) {
    return { ...initialValue, ...storedValue } as Value
  }
  return storedValue as Value
}

export const setItem = (key: string, value: ValueType) => {
  const envelope: StorageEnvelope<ValueType> = {
    version: STORAGE_SCHEMA_VERSION,
    value,
  }
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(envelope))
  } catch {
    // Storage may be disabled or full; UI state remains usable in memory.
  }
}

export const getItem = <Value>(key: string, initialValue: Value): Value => {
  try {
    const rawValue = window.localStorage.getItem(storageKey(key))
    if (!rawValue) return initialValue
    const parsed = JSON.parse(rawValue) as StorageEnvelope<unknown> | unknown
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      'value' in parsed
    ) {
      const envelope = parsed as StorageEnvelope<unknown>
      if (envelope.version !== STORAGE_SCHEMA_VERSION) {
        removeItem(key)
        return initialValue
      }
      return mergeWithDefaults(initialValue, envelope.value)
    }

    // Migrate the unversioned format written by releases before schema v1.
    const migrated = mergeWithDefaults(initialValue, parsed)
    setItem(key, migrated as ValueType)
    return migrated
  } catch {
    removeItem(key)
    return initialValue
  }
}

export const removeItem = (key: string) => {
  try {
    window.localStorage.removeItem(storageKey(key))
  } catch {
    // Ignore unavailable storage.
  }
}

export const atomWithLocalStorage = <Value>(
  key: string,
  initialValue: Value,
) => {
  const baseAtom = atom(getItem(key, initialValue))
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
    },
  )
}
