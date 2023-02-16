import { getCurrHashAtom } from '@/components/Details/atoms'
import { Files } from '@/types'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { API } from '@/utils/api'

const PathSeparator = '/'

const getFileExtension = function (filename: string) {
  const pointIndex = filename.lastIndexOf('.')
  if (pointIndex === -1) return ''
  return filename.substring(pointIndex + 1)
}

const getFileName = function (filepath: string) {
  const slashIndex = filepath.lastIndexOf(PathSeparator)
  if (slashIndex === -1) return filepath
  return filepath.substring(slashIndex + 1)
}

const getFolderName = function (filepath: string) {
  const slashIndex = filepath.lastIndexOf(PathSeparator)
  if (slashIndex === -1) return ''
  return filepath.substring(0, slashIndex)
}

export const useFiles = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  const { data } = useSWR<Files>(
    currHash ? API.torrents.files(currHash) : null,
    { keepPreviousData: true, fallbackData: [] }
  )

  if (!data) return []

  const treeFiles = []

  for (const file of data) {
    const filename = file.name
    const newFile = { ...file, filename }
    const rootNode = {}
    let parentNode = rootNode

    const pathItems = filename.split(PathSeparator)
    pathItems.pop()
    for (const path of pathItems) {
      if (!parentNode.subRows) {
        parentNode.subRows = [{ name: path }]
        parentNode = parentNode.subRows
      } else {
      }
    }
  }

  return data
}
