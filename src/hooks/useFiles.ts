import { useMemo } from 'react'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { getCurrHashAtom } from '@/pages/Home/Details/atoms'
import { FileType, Files } from '@/types'
import { API } from '@/api/endpoints'

const PathSeparator = '/'

type TreeNode = {
  availability: number
  is_seed?: boolean
  name: string
  priority: number
  progress: number
  size: number
  subRows: TreeNode[]
}

const initNode = (name: string, file: FileType): TreeNode => ({
  availability: 0,
  is_seed: file.is_seed,
  name,
  priority: file.priority,
  progress: file.progress,
  size: file.size,
  subRows: [],
})

function recalcNode(node: TreeNode, file: FileType): void {
  const { priority, progress, size } = file
  node.progress =
    (node.progress * node.size + progress * size) / (node.size + size)
  node.size += size
}

function buildTree(fileArray: Files): TreeNode[] {
  const tree: TreeNode[] = []

  for (const file of fileArray) {
    const pathComponents = file.name.split(PathSeparator)
    let currentTree = tree

    for (const name of pathComponents) {
      const existingNode = currentTree.find((node) => node.name === name)

      if (existingNode) {
        currentTree = existingNode.subRows
        recalcNode(existingNode, file)
      } else {
        const newNode: TreeNode = initNode(name, file)
        currentTree.push(newNode)
        currentTree = newNode.subRows
      }
    }
  }

  return tree
}

export const useFiles = () => {
  const [currHash] = useAtom(getCurrHashAtom)
  const { data } = useSWR<Files>(
    currHash ? API.torrents.files(currHash) : null,
    { refreshInterval: 5000, keepPreviousData: true, fallbackData: [] }
  )

  if (!data) return []
  // console.log(new Date().toLocaleTimeString(), { data })

  const rows = useMemo(() => buildTree(data), [data])
  // console.log(new Date().toLocaleTimeString(), { rows })
  return rows
}
