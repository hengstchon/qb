export type TorrentFilePriority = 0 | 1 | 6 | 7

export type TorrentMetadataFile = {
  path: string
  length: number
  priority?: TorrentFilePriority
}

export type TorrentMetadata = {
  /** WebAPI 2.15 and earlier cache identifier. */
  hash?: string
  /** Newer WebAPI cache identifier. */
  torrent_id?: string
  infohash_v1?: string
  infohash_v2?: string
  info_hash_v1?: string
  info_hash_v2?: string
  info: {
    files: TorrentMetadataFile[]
    length: number
    name: string
    piece_length: number
    pieces_num: number
    private: boolean
  }
  trackers?: string[]
  webseeds?: string[]
  created_by?: string
  creation_date?: number
  comment?: string
}

export const torrentMetadataId = (metadata: TorrentMetadata) =>
  metadata.torrent_id ||
  metadata.hash ||
  metadata.infohash_v1 ||
  metadata.infohash_v2 ||
  metadata.info_hash_v1 ||
  metadata.info_hash_v2 ||
  ''

export type TorrentFileTreeNode = {
  name: string
  path: string
  children: TorrentFileTreeNode[]
  fileIndex?: number
}

export const buildTorrentFileTree = (
  files: TorrentMetadataFile[],
): TorrentFileTreeNode[] => {
  const root: TorrentFileTreeNode[] = []

  files.forEach((file, fileIndex) => {
    const parts = file.path.split('/').filter(Boolean)
    let siblings = root
    let path = ''

    parts.forEach((part, partIndex) => {
      path = path ? `${path}/${part}` : part
      let node = siblings.find((candidate) => candidate.name === part)
      if (!node) {
        node = { name: part, path, children: [] }
        siblings.push(node)
      }
      if (partIndex === parts.length - 1) node.fileIndex = fileIndex
      siblings = node.children
    })
  })

  return root
}

export const initialFilePriorities = (
  files: TorrentMetadataFile[],
): TorrentFilePriority[] =>
  files.map((file) => (file.priority === 0 ? 0 : file.priority || 1))
