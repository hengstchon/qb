import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { categoriesAtom, torrentsAtom } from '../atoms'
import { torsColFiltersAtom } from '../Torrents'
import { openSideCatAtom } from './atoms'
import { List, ListItem } from './BaseList'

const categoryFilterAtom = focusAtom(torsColFiltersAtom, (optic) =>
  optic.find((x) => x.id == 'category').prop('value'),
)

const FIX_CATEGORIES = ['All', 'Uncategorized']

const Categories = () => {
  const [openCategories, setOpenCategories] = useAtom(openSideCatAtom)
  const [categories] = useAtom(categoriesAtom)
  // console.log(categories)
  const [filter, setFilter] = useAtom(categoryFilterAtom)

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

  const categoriesList = [...FIX_CATEGORIES, ...Object.keys(categories)]

  function handleClick(cat: string) {
    console.log(cat)
    if (FIX_CATEGORIES.includes(cat)) {
      if (filter != '') {
        setFilter('')
      }
    } else {
      if (filter != cat) {
        setFilter(cat)
      }
    }
  }

  return (
    <List title="Categories" open={openCategories} setOpen={setOpenCategories}>
      {categoriesList.map((category) => {
        return (
          <ListItem key={category} onClick={() => handleClick(category)}>
            <span className="truncate">{category}</span>
            <span>({getNumByCategory(category)})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Categories
