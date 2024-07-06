export type FileType = {
  availability: number
  index: number
  is_seed?: boolean
  name: string
  piece_range: [number, number]
  priority: number
  progress: number
  size: number
}

export type Files = FileType[]

export type FileNode = {
  availability: number
  is_seed?: boolean
  name: string
  priority: number
  progress: number
  size: number
  remaining: number
  subRows: FileNode[]
}
