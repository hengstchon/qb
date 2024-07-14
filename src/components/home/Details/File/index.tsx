import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { atom, useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import DataTable from '@/components/common/DataTable'
import { filesColumns } from '@/config/columns'
import { useFiles } from '@/hooks/useFiles'
import { fileTableAtom } from '@/store/global'
import { FileNode } from '@/types'

const filesColOrderAtom = focusAtom(fileTableAtom, (optic) =>
  optic.prop('columnOrder'),
)
const filesColSizingAtom = focusAtom(fileTableAtom, (optic) =>
  optic.prop('columnSizing'),
)
const filesColVisiAtom = focusAtom(fileTableAtom, (optic) =>
  optic.prop('columnVisibility'),
)
const filesSortAtom = focusAtom(fileTableAtom, (optic) => optic.prop('sorting'))

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

  return (
    <div className="grid gap-2">
      <div className="overflow-auto">
        <DataTable<FileNode>
          table={table}
          colOrderAtom={filesColOrderAtom}
          currRowAtom={currRowAtom}
        />
      </div>
    </div>
  )
}

export default Content
