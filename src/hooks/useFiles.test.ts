import { describe, expect, it } from 'vitest'
import { buildFileTree } from './useFiles'

describe('file tree building', () => {
  it('builds thousands of sibling files without quadratic lookups', () => {
    const files = Array.from({ length: 5_000 }, (_, index) => ({
      availability: 1,
      index,
      name: `root/file-${index}.bin`,
      piece_range: [index, index] as [number, number],
      priority: 1,
      progress: 0,
      size: 1,
    }))
    const startedAt = performance.now()
    const tree = buildFileTree(files)

    expect(tree[0].subRows).toHaveLength(5_000)
    expect(performance.now() - startedAt).toBeLessThan(250)
  })
})
