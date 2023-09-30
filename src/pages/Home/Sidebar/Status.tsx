import { useAtom } from 'jotai'
import { statusList } from '@/lib/constants'
import { statusFilterAtom, torrentsAtom } from '../atoms'
import { openSideStatusAtom } from './atoms'
import { List, ListItem } from './BaseList'

const Status = () => {
  const [openStatus, setOpenStatus] = useAtom(openSideStatusAtom)
  const [currentFilter, setCurrentFilter] = useAtom(statusFilterAtom)
  const [torrents] = useAtom(torrentsAtom)

  return (
    <List title="Status" open={openStatus} setOpen={setOpenStatus}>
      {statusList.map(({ name, filterValue, filterFn }) => {
        return (
          <ListItem
            key={name}
            selected={currentFilter === filterValue}
            onClick={() => {
              currentFilter !== filterValue && setCurrentFilter(filterValue)
            }}
          >
            <span className="truncate">{name}</span>
            <span>({Object.values(torrents).filter(filterFn).length})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Status
