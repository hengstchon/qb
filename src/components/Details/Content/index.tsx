import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import {
  currRowAtom,
  filesColOrderAtom,
  filesColSizingAtom,
  filesColVisiAtom,
  filesSortAtom,
} from './atoms'
import { filesColumns } from './columns'
import { File, Files } from '@/types'
import BaseTable from '@/components/BaseTable'
import { getCurrHashAtom } from '../atoms'
import useSWR from 'swr'
import { API } from '@/utils/api'

const Content = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  const { data } = useSWR<Files>(
    currHash ? API.torrents.files(currHash) : null,
    { keepPreviousData: true, fallbackData: [] }
  )

  const [columnOrder, onColumnOrderChange] = useAtom(filesColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(filesColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(filesColVisiAtom)
  const [sorting, onSortingChange] = useAtom(filesSortAtom)

  const table = useReactTable({
    data: data!,
    columns: filesColumns,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      sorting,
    },
    onColumnOrderChange,
    onColumnSizingChange,
    onColumnVisibilityChange,
    onSortingChange,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="grid gap-2">
      <div className="overflow-auto">
        <BaseTable<File>
          table={table}
          colOrderAtom={filesColOrderAtom}
          currRowAtom={currRowAtom}
        />
      </div>
    </div>
  )
}

export default Content
