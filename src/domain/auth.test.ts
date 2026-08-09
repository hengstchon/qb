import { describe, expect, it } from 'vitest'
import { isSuccessfulLoginResponse, loginErrorMessage } from './auth'

describe('authentication errors', () => {
  it('accepts legacy text and current empty 204 login success responses', () => {
    expect(isSuccessfulLoginResponse('Ok.')).toBe(true)
    expect(isSuccessfulLoginResponse(undefined)).toBe(true)
    expect(isSuccessfulLoginResponse('Fails.')).toBe(false)
  })

  it('distinguishes rejected credentials, bans, and network failures', () => {
    expect(loginErrorMessage(401)).toContain('incorrect')
    expect(loginErrorMessage(403)).toContain('temporarily blocked')
    expect(loginErrorMessage()).toContain('Unable to reach')
  })
})
