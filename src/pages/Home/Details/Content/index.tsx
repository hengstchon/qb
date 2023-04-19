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
import BaseTable from '@/components/Table'
import { useFiles } from '@/hooks/useFiles'
import { useVirtualizer } from '@tanstack/react-virtual'
import React from 'react'

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
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    // parentRef: tableContainerRef,
    // size: rows.length,
    // overscan: 10,
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    debug: true,
  })
  console.log('size:', rowVirtualizer.getTotalSize())
  return (
    <div className="grid gap-2">
      <div ref={tableContainerRef} className="overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <BaseTable<File>
            table={table}
            colOrderAtom={filesColOrderAtom}
            currRowAtom={currRowAtom}
          />
        </div>
      </div>
    </div>
  )
}

export default Content
