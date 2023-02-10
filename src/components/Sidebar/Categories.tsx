import { useAtom } from 'jotai'
import { categoriesAtom, torrentsAtom } from '../Homepage/atoms'
import { openCategoriesAtom } from './atoms'
import { BaseCollapsible } from './Base'

const Categories = () => {
  const [openCategories, setOpenCategories] = useAtom(openCategoriesAtom)
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

  return (
    <BaseCollapsible
      title="Categories"
      open={openCategories}
      setOpen={setOpenCategories}
      itemList={['All', 'Uncategorized', ...Object.keys(categories)]}
      getNum={getNumByCategory}
    />
  )
}

export default Categories
