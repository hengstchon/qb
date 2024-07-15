import { useAtom } from 'jotai'
import { statusList } from '@/config/constants'
import { statusFilterAtom, torrentsAtom } from '@/store/global'
import { openSideStatusAtom } from '@/store/sidebar'
import { SideBlock, SideBlockItem } from './SideBlock'

const Status = () => {
  const [openStatus, setOpenStatus] = useAtom(openSideStatusAtom)
  const [currentFilter, setCurrentFilter] = useAtom(statusFilterAtom)
  const [torrents] = useAtom(torrentsAtom)

  return (
    <SideBlock title="Status" open={openStatus} setOpen={setOpenStatus}>
      {statusList.map(({ name, filterValue, filterFn }) => {
        return (
          <SideBlockItem
            key={name}
            selected={currentFilter === filterValue}
            onClick={() => {
              currentFilter !== filterValue && setCurrentFilter(filterValue)
            }}
          >
            <span className="truncate">{name}</span>
            <span>({Object.values(torrents).filter(filterFn).length})</span>
          </SideBlockItem>
        )
      })}
    </SideBlock>
  )
}

export default Status
