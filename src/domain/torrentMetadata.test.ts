import { describe, expect, it } from 'vitest'
import { buildTorrentFileTree, initialFilePriorities } from './torrentMetadata'

describe('torrent metadata helpers', () => {
  const files = [
    { path: 'docs/readme.txt', length: 10 },
    { path: 'docs/api/reference.md', length: 20, priority: 6 as const },
    { path: 'cover.jpg', length: 30, priority: 0 as const },
  ]

  it('builds a stable nested file tree while retaining source indexes', () => {
    expect(buildTorrentFileTree(files)).toEqual([
      {
        name: 'docs',
        path: 'docs',
        children: [
          {
            name: 'readme.txt',
            path: 'docs/readme.txt',
            children: [],
            fileIndex: 0,
          },
          {
            name: 'api',
            path: 'docs/api',
            children: [
              {
                name: 'reference.md',
                path: 'docs/api/reference.md',
                children: [],
                fileIndex: 1,
              },
            ],
          },
        ],
      },
      {
        name: 'cover.jpg',
        path: 'cover.jpg',
        children: [],
        fileIndex: 2,
      },
    ])
  })

  it('defaults files to normal priority and preserves server priorities', () => {
    expect(initialFilePriorities(files)).toEqual([1, 6, 0])
  })
})
