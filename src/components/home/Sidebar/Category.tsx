import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'
import { FIX_CATEGORIES } from '@/config/constants'
import { categoriesAtom, torrentsAtom } from '@/store/global'
import { openSideCatAtom } from '@/store/sidebar'
import { torsColFiltersAtom } from '../Torrents'
import { List, ListItem } from './BaseList'

const categoryFilterAtom = focusAtom(torsColFiltersAtom, (optic) =>
  optic.find((x) => x.id == 'category').prop('value'),
)

const Categories = () => {
  const [openCategories, setOpenCategories] = useAtom(openSideCatAtom)
  const [categories] = useAtom(categoriesAtom)
  // console.log(categories)
  const [currentFilter, setCurrentFilter] = useAtom(categoryFilterAtom)

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

  const categoriesList = [
    ...FIX_CATEGORIES,
    ...Object.keys(categories).map((cat) => ({ name: cat, filterValue: cat })),
  ]

  return (
    <List title="Categories" open={openCategories} setOpen={setOpenCategories}>
      {categoriesList.map(({ name, filterValue }) => {
        return (
          <ListItem
            key={name}
            selected={currentFilter === filterValue}
            onClick={() => {
              currentFilter !== filterValue && setCurrentFilter(filterValue)
            }}
          >
            <span className="truncate">{name}</span>
            <span>({getNumByCategory(name)})</span>
          </ListItem>
        )
      })}
    </List>
  )
}

export default Categories
