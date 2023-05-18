import { Table } from '@tanstack/react-table'
import { Torrent } from '@/lib/types'
import { Button } from '@/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select'

const Pagination = ({ table }: { table: Table<Torrent> }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <Button
        variant="outline"
        size="sm"
        className="rounded-md border p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-md border p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-md border p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-md border p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </Button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className="w-16 rounded-md border p-1"
        />
      </span>
      <Select
        onValueChange={(value) => {
          table.setPageSize(Number(value))
        }}
      >
        <SelectTrigger className="h-8 w-32">
          <SelectValue>{table.getState().pagination.pageSize}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {[1, 10, 20, 30, 50, 100].map((pageSize) => (
            <SelectItem key={pageSize} value={String(pageSize)}>
              Show {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Pagination
