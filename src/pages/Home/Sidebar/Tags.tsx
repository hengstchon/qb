import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { FIX_TAGS } from '@/lib/constants'
import { tagsAtom, torrentsAtom } from '../atoms'
import { torsColFiltersAtom } from '../Torrents'
import { openSideTagsAtom } from './atoms'
import { List, ListItem } from './BaseList'

const tagFilterAtom = focusAtom(torsColFiltersAtom, (optic) =>
  optic.find((x) => x.id == 'tags').prop('value'),
)

const Tags = () => {
  const [openTags, setOpenTags] = useAtom(openSideTagsAtom)
  const [tags] = useAtom(tagsAtom)
  const [currentFilter, setCurrentFilter] = useAtom(tagFilterAtom)
  const [torrents] = useAtom(torrentsAtom)

  const getNumByTag = (tag: string) => {
    const torsArr = Object.values(torrents)
    if (tag === 'All') {
      return torsArr.length
    } else if (tag === 'Untagged') {
      return torsArr.filter((t) => t.tags.length === 0).length
    } else {
      return torsArr.filter((t) => t.tags.indexOf(tag) !== -1).length
    }
  }

  const tagsList = [
    ...FIX_TAGS,
    ...tags.map((t) => ({ name: t, filterValue: t })),
  ]

  return (
    <List title="Tags" open={openTags} setOpen={setOpenTags}>
      {tagsList.map(({ name, filterValue }) => {
        return (
          <ListItem
            key={name}
            selected={currentFilter === filterValue}
            onClick={() => {
              currentFilter !== filterValue && setCurrentFilter(filterValue)
            }}
          >
            <span className="truncate">{name}</span>
            <span>({getNumByTag(name)})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Tags
