import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { atom, useAtom } from 'jotai'
import { filesColumns } from './columns'
import BaseTable from '@/components/Table'
import { useFiles } from '@/hooks/useFiles'
import { FileNode } from '@/types'
import { focusAtom } from 'jotai-optics'
import { tablesAtom } from '@/pages/Home/atoms'

const torrentsTableAtom = focusAtom(tablesAtom, (optic) =>
  optic.prop('filesTable')
)
const filesColOrderAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnOrder')
)
const filesColSizingAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnSizing')
)
const filesColVisiAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('columnVisibility')
)
const filesSortAtom = focusAtom(torrentsTableAtom, (optic) =>
  optic.prop('sorting')
)

const currRowAtom = atom(-1)

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
  const virtualize = table.getRowModel().flatRows.length > 100

  return (
    <div className="grid gap-2">
      <div className="overflow-auto">
        <BaseTable<FileNode>
          table={table}
          colOrderAtom={filesColOrderAtom}
          currRowAtom={currRowAtom}
          virtualize={virtualize}
        />
      </div>
    </div>
  )
}

export default Content
