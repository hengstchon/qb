import { useAtom } from 'jotai'
import { tagsAtom, torrentsAtom } from '@/components/Homepage/atoms'
import { openSideTagsAtom } from './atoms'
import { BaseCollapsible } from './Base'

const Tags = () => {
  const [openTags, setOpenTags] = useAtom(openSideTagsAtom)
  const [tags] = useAtom(tagsAtom)
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

  return (
    <BaseCollapsible
      title="Tags"
      open={openTags}
      setOpen={setOpenTags}
      itemList={['All', 'Untagged', ...tags]}
      getNum={getNumByTag}
    />
  )
}

export default Tags
