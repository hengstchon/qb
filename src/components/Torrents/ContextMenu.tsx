import { Torrent } from '@/types'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/ui/ContextMenu'
import { Table } from '@tanstack/react-table'
import React from 'react'

const HeaderContextMenu = ({
  table,
  children,
}: {
  table: Table<Torrent>
  children: React.ReactElement[]
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="">
        {table.getAllColumns().map((c) => {
          const { id, header } = c.columnDef
          return (
            <ContextMenuCheckboxItem
              key={c.id}
              className="capitalize"
              checked={c.getIsVisible()}
              onClick={c.getToggleVisibilityHandler()}
            >
              {typeof header == 'string' ? header : id}
            </ContextMenuCheckboxItem>
          )
        })}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default HeaderContextMenu
