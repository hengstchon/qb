import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { Input } from '@/ui/Input'
import { torsColFiltersAtom } from '../Torrents'

const nameFilterAtom = focusAtom(torsColFiltersAtom, (optic) =>
  optic.find((x) => x.id == 'name').prop('value'),
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

  return (
    <Input
      className="w-[400px]"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default FilterInput
