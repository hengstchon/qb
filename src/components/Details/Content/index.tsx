import {
  getCoreRowModel,
  getExpandedRowModel,
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
import { File } from '@/types'
import BaseTable from '@/components/BaseTable'
import { useFiles } from '@/hooks/useFiles'

const FilePriority = {
  Ignored: 0,
  Normal: 1,
  High: 6,
  Maximum: 7,
  Mixed: -1,
}

const TriState = {
  Unchecked: 0,
  Checked: 1,
  Partial: 2,
}

const Content = () => {
  const data = useFiles()

  const [columnOrder, onColumnOrderChange] = useAtom(filesColOrderAtom)
  const [columnSizing, onColumnSizingChange] = useAtom(filesColSizingAtom)
  const [columnVisibility, onColumnVisibilityChange] = useAtom(filesColVisiAtom)
  const [sorting, onSortingChange] = useAtom(filesSortAtom)

  const table = useReactTable({
    data,
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
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
