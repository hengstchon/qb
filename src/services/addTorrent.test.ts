import { describe, expect, it, vi } from 'vitest'
import { capabilitiesForWebApi } from '@/domain/capabilities'
import { addTorrents } from './addTorrent'
import { QbApiError } from './client'

const apiWithResponse = (value: unknown) => ({
  postMultipart: vi.fn().mockResolvedValue(value),
})

describe('Add Torrent compatibility', () => {
  const qb4 = capabilitiesForWebApi('2.8.3')
  const qb5 = capabilitiesForWebApi('2.14.3')

  it('keeps legacy cookie support and parses text responses on 4.x', async () => {
    const api = apiWithResponse('Ok.')
    const result = await addTorrents(
      { urls: 'magnet:?xt=urn:test', cookie: 'name=value' },
      qb4,
      api,
    )

    expect(result.kind).toBe('added')
    expect(api.postMultipart).toHaveBeenCalledWith(
      '/torrents/add',
      expect.objectContaining({ cookie: 'name=value' }),
      'text',
    )
  })

  it('omits the removed cookie field and parses structured 5.x responses', async () => {
    const api = apiWithResponse({
      success_count: 1,
      pending_count: 0,
      failure_count: 0,
      added_torrent_ids: ['abc'],
    })
    const result = await addTorrents(
      { urls: 'magnet:?xt=urn:test', cookie: 'must-not-leak' },
      qb5,
      api,
    )

    expect(result.kind).toBe('added')
    expect(api.postMultipart.mock.calls[0][1]).not.toHaveProperty('cookie')
    expect(api.postMultipart.mock.calls[0][2]).toBe('json')
  })

  it.each([
    [{ success_count: 0, pending_count: 1, failure_count: 0 }, 'pending'],
    [{ success_count: 1, pending_count: 0, failure_count: 1 }, 'partial'],
    [{ success_count: 0, pending_count: 0, failure_count: 2 }, 'failed'],
  ] as const)('classifies structured outcomes', async (response, kind) => {
    await expect(
      addTorrents({}, qb5, apiWithResponse(response)),
    ).resolves.toMatchObject({
      kind,
    })
  })

  it('distinguishes duplicate and invalid requests', async () => {
    const duplicateApi = {
      postMultipart: vi.fn().mockRejectedValue(
        new QbApiError({
          message: 'Torrent already exists',
          status: 409,
          endpoint: '/torrents/add',
          serverMessage: 'Torrent already exists',
        }),
      ),
    }
    const invalidApi = {
      postMultipart: vi.fn().mockRejectedValue(
        new QbApiError({
          message: 'Unsupported Media Type',
          status: 415,
          endpoint: '/torrents/add',
        }),
      ),
    }

    await expect(addTorrents({}, qb5, duplicateApi)).resolves.toMatchObject({
      kind: 'duplicate',
    })
    await expect(addTorrents({}, qb5, invalidApi)).resolves.toMatchObject({
      kind: 'invalid',
    })
  })
})
