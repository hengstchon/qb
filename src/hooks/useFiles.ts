import { useMemo } from 'react'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { API } from '@/api/endpoints'
import { FilePriority } from '@/lib/constants'
import { FileNode, Files, FileType } from '@/lib/types'
import { getCurrHashAtom } from '@/pages/Home/atoms'

const PathSeparator = '/'

const initNode = (name: string, file: FileType): FileNode => ({
  availability: file.availability,
  is_seed: file.is_seed,
  name,
  priority: file.priority,
  progress: file.progress,
  size: file.size,
  remaining: file.size * (1 - file.progress),
  subRows: [],
})

function recalcNode(node: FileNode, file: FileType): void {
  const { availability, priority, progress, size } = file
  node.progress =
    (node.progress * node.size + progress * size) / (node.size + size)
  node.availability =
    (node.availability * node.size + availability * size) / (node.size + size)
  node.remaining += file.size * (1 - file.progress)
  node.size += size
  if (priority != node.priority) {
    node.priority = FilePriority.Mixed
  }
}

function buildTree(fileArray: Files): FileNode[] {
  const tree: FileNode[] = []

  for (const file of fileArray) {
    const pathComponents = file.name.split(PathSeparator)
    let currentTree = tree

    for (const name of pathComponents) {
      const existingNode = currentTree.find((node) => node.name === name)

      if (existingNode) {
        currentTree = existingNode.subRows
        const isIgnored = file.priority == FilePriority.Ignored
        if (!isIgnored) {
          recalcNode(existingNode, file)
        }
      } else {
        const newNode: FileNode = initNode(name, file)
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
    { refreshInterval: 5000, keepPreviousData: true, fallbackData: [] },
  )

  if (!data) return []
  // console.log(new Date().toLocaleTimeString(), { data })

  const rows = useMemo(() => buildTree(data), [data])
  // console.log(new Date().toLocaleTimeString(), { rows })
  return rows
}
