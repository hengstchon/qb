import { useAtom } from 'jotai'
import { tagsAtom, torrentsAtom } from '../atoms'
import { openSideTagsAtom } from './atoms'
import { List, ListItem } from './BaseList'

const Tags = () => {
  const [openTags, setOpenTags] = useAtom(openSideTagsAtom)
  const [tags] = useAtom(tagsAtom)
  // console.log(tags)
  const [torrents] = useAtom(torrentsAtom)
  // console.log(
  //   Object.values(torrents).length ? Object.values(torrents)[0].tags : null,
  // )

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

  const tagsList = ['All', 'Untagged', ...tags]

  return (
    <List title="Tags" open={openTags} setOpen={setOpenTags}>
      {tagsList.map((tag) => {
        return (
          <ListItem key={tag}>
            <span className="truncate">{tag}</span>
            <span>({getNumByTag(tag)})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Tags
