import { getCurrHashAtom } from '@/components/Details/atoms'
import { Files } from '@/types'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { API } from '@/utils/api'
import { useEffect, useMemo } from 'react'

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

const initNode = () => ({
  name: '',
  size: 0,
})

export const useFiles = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  const { data } = useSWR<Files>(
    currHash ? API.torrents.files(currHash) : null,
    { keepPreviousData: true, fallbackData: [] }
  )

  if (!data) return []

  const treeFiles = []

  const rootNode = initNode()

  // A/B/C.mkv
  // A/C.mkv
  // B/C.mkv
  // C.mkv
  for (const file of data) {
    const wholeName = file.name
    let parentNode = rootNode

    const pathItems = wholeName.split(PathSeparator)
    // the last one must be the file node
    const fileName = pathItems.pop()

    // folder nodes (might be empty)
    for (const path of pathItems) {
      if (!parentNode.subRows) {
        const newNode = initNode()
        newNode.name = path
        newNode.size += file.size
        parentNode.subRows = [newNode]
        parentNode = newNode
      } else {
        const p = parentNode.subRows.find((node) => node.name === path)
        if (p) {
          p.size += file.size
          parentNode = p
        } else {
          const newNode = initNode()
          newNode.name = path
          newNode.size += file.size
          parentNode.subRows.push(newNode)
          parentNode = newNode
        }
      }
    }
    // file node
    parentNode.subRows = parentNode.subRows
      ? [...parentNode.subRows, { ...file, name: fileName }]
      : [{ ...file, name: fileName }]
  }
  // window.o = rootNode
  const rows = useMemo(() => rootNode.subRows ?? [], [data])
  console.log(rows)
  return rows

  // return data
}
