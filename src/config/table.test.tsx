import { createColumnHelper, flexRender, useTable } from '@tanstack/react-table'
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSelectColumn } from '@/components/common/DataTable/selectColumn'
import { appTableFeatures, type AppTableFeatures } from './table'

type Entry = { name: string; size: number; subRows?: Entry[] }
const ch = createColumnHelper<AppTableFeatures, Entry>()
const columns = ch.columns([
  createSelectColumn<Entry>(),
  ch.accessor('name', { header: 'Name' }),
  ch.accessor('size', { header: 'Size' }),
])
const data: Entry[] = [
  { name: 'Torrent 10', size: 100 },
  { name: 'Torrent 2', size: 20 },
  { name: 'Other', size: 5 },
]

describe('table interactions after the Table 9 migration', () => {
  it('combines case-insensitive name filtering with natural and numeric sorting', () => {
    const { result } = renderHook(() =>
      useTable({ features: appTableFeatures, columns, data }),
    )
    act(() => {
      result.current.setColumnFilters([{ id: 'name', value: 'TORRENT' }])
      result.current.setSorting([{ id: 'name', desc: false }])
    })
    expect(
      result.current.getRowModel().rows.map((row) => row.original.name),
    ).toEqual(['Torrent 2', 'Torrent 10'])
    act(() => result.current.setSorting([{ id: 'size', desc: true }]))
    expect(
      result.current.getRowModel().rows.map((row) => row.original.size),
    ).toEqual([100, 20])
  })

  it('handles individual checkboxes and switches select-all from mixed to checked', () => {
    const SelectAll = () => {
      const table = useTable({ features: appTableFeatures, columns, data })
      const header = table.getHeaderGroups()[0].headers[0]
      return (
        <>
          {flexRender(header.column.columnDef.header, header.getContext())}
          {table.getRowModel().rows.map((row) => {
            const cell = row.getVisibleCells()[0]
            return (
              <span key={row.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            )
          })}
        </>
      )
    }
    render(<SelectAll />)
    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' })
    const rowCheckbox = screen.getByRole('checkbox', { name: 'Select row 0' })
    fireEvent.click(rowCheckbox)
    expect(rowCheckbox).toBeChecked()
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(checkbox).toHaveAttribute('data-state', 'checked')
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('expands nested files without losing their selection', () => {
    const nested: Entry[] = [
      { name: 'root', size: 1, subRows: [{ name: 'file', size: 1 }] },
    ]
    const { result } = renderHook(() =>
      useTable({
        features: appTableFeatures,
        columns,
        data: nested,
        getSubRows: (row) => row.subRows,
      }),
    )
    act(() => result.current.toggleAllRowsExpanded(true))
    expect(result.current.getRowModel().rows).toHaveLength(2)
    act(() => result.current.getRowModel().rows[1].toggleSelected(true))
    act(() => result.current.toggleAllRowsExpanded(false))
    expect(result.current.getRowModel().rows).toHaveLength(1)
    act(() => result.current.toggleAllRowsExpanded(true))
    expect(result.current.getRowModel().rows[1].getIsSelected()).toBe(true)
  })
})
