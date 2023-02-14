import { Input } from '@/ui/Input'
import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { torsColFiltersAtom } from '../Torrents/atoms'

const nameFilterAtom = atom(
  (get) => get(torsColFiltersAtom)[0].value,
  (_, set, newValue) =>
    set(torsColFiltersAtom, () => [{ id: 'name', value: newValue }])
)

const FilterInput = () => {
  const [filter, setFilter] = useAtom(nameFilterAtom)
  const [value, setValue] = useState<string>(filter as string)

  useEffect(() => {
    if (value !== filter) {
      setValue(filter as string)
    }
  }, [filter])

  const debounce = 500
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <Input value={value} onChange={(e) => setValue(e.target.value)} />
}

export default FilterInput
