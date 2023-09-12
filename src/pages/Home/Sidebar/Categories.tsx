import { useAtom } from 'jotai'
import { categoriesAtom, torrentsAtom } from '../atoms'
import { openSideCatAtom } from './atoms'
import { List, ListItem } from './BaseList'

const Categories = () => {
  const [openCategories, setOpenCategories] = useAtom(openSideCatAtom)
  const [categories] = useAtom(categoriesAtom)
  const [torrents] = useAtom(torrentsAtom)

  const getNumByCategory = (cat: string) => {
    const torsArr = Object.values(torrents)
    if (cat === 'All') {
      return torsArr.length
    } else if (cat === 'Uncategorized') {
      return torsArr.filter((t) => t.category.length === 0).length
    } else {
      return torsArr.filter((t) => t.category === cat).length
    }
  }

  const categoriesList = ['All', 'Uncategorized', ...Object.keys(categories)]

  return (
    <List title="Categories" open={openCategories} setOpen={setOpenCategories}>
      {categoriesList.map((category) => {
        return (
          <ListItem key={category}>
            <span className="truncate">{category}</span>
            <span>({getNumByCategory(category)})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Categories
