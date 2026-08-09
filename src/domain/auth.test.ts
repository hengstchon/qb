import { describe, expect, it } from 'vitest'
import { loginErrorMessage } from './auth'

describe('authentication errors', () => {
  it('distinguishes rejected credentials, bans, and network failures', () => {
    expect(loginErrorMessage(401)).toContain('incorrect')
    expect(loginErrorMessage(403)).toContain('temporarily blocked')
    expect(loginErrorMessage()).toContain('Unable to reach')
  })
})
