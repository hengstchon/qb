import { describe, expect, it } from 'vitest'
import { applyPeerDelta } from './peer'

describe('peer delta updates', () => {
  it('applies additions, changes, and removals in one structural-sharing pass', () => {
    const unchanged = { ip: '127.0.0.1', progress: 0.5 }
    const current = {
      unchanged,
      changed: { ip: '127.0.0.2', progress: 0.25 },
      removed: { ip: '127.0.0.3' },
    }
    const next = applyPeerDelta(current, {
      rid: 2,
      peers: {
        changed: { progress: 0.75 },
        added: { i2p_dest: 'example.b32.i2p' },
      },
      peers_removed: ['removed'],
    })

    expect(next.unchanged).toBe(unchanged)
    expect(next.changed).toMatchObject({ ip: '127.0.0.2', progress: 0.75 })
    expect(next.added.i2p_dest).toBe('example.b32.i2p')
    expect(next).not.toHaveProperty('removed')
  })
})
