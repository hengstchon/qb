// @vitest-environment node

import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { describe, expect, it } from 'vitest'
import { apiServer } from '@/test/server'
import { QbApiClient, QbApiError } from './client'

const api = new QbApiClient('http://localhost/api/v2', 100)

describe('QbApiClient', () => {
  it('encodes query and form values without changing special characters', async () => {
    const expected = 'space & plus+ 非ASCII'
    apiServer.use(
      http.post('*/api/v2/form', async ({ request }) => {
        const form = new URLSearchParams(await request.text())
        return HttpResponse.text(form.get('value') ?? '')
      }),
      http.get('*/api/v2/query', ({ request }) => {
        const url = new URL(request.url)
        return HttpResponse.json({ value: url.searchParams.get('value') })
      }),
    )

    await expect(
      api.postForm<string>('/form', { value: expected }, 'text'),
    ).resolves.toBe(expected)
    await expect(
      api.getJson<{ value: string }>({
        endpoint: '/query',
        query: { value: expected },
      }),
    ).resolves.toEqual({ value: expected })
  })

  it('handles JSON, text, blob, and empty responses explicitly', async () => {
    apiServer.use(
      http.get('*/api/v2/json', () => HttpResponse.json({ ok: true })),
      http.get('*/api/v2/text', () => HttpResponse.text('Ok.')),
      http.get(
        '*/api/v2/blob',
        () => new HttpResponse('torrent', { status: 200 }),
      ),
      http.post(
        '*/api/v2/empty',
        () => new HttpResponse(null, { status: 204 }),
      ),
    )

    await expect(api.getJson('/json')).resolves.toEqual({ ok: true })
    await expect(api.getText('/text')).resolves.toBe('Ok.')
    await expect(api.getBlob('/blob')).resolves.toBeInstanceOf(Blob)
    await expect(api.postForm('/empty', {})).resolves.toBeUndefined()
  })

  it('preserves multipart files and non-ASCII option values', async () => {
    apiServer.use(
      http.post('*/api/v2/multipart', async ({ request }) => {
        const form = await request.formData()
        const torrent = form.get('torrents')
        return HttpResponse.json({
          category: form.get('category'),
          fileName: torrent instanceof File ? torrent.name : null,
        })
      }),
    )

    await expect(
      api.postMultipart<{ category: string; fileName: string }>(
        '/multipart',
        {
          category: '影视 & 动画+',
          torrents: [new File(['torrent'], '特殊 名称.torrent')],
        },
        'json',
      ),
    ).resolves.toEqual({
      category: '影视 & 动画+',
      fileName: '特殊 名称.torrent',
    })
  })

  it('uses optional authorization only from in-memory configuration', async () => {
    apiServer.use(
      http.get('*/api/v2/authorization', ({ request }) =>
        HttpResponse.text(request.headers.get('Authorization') ?? ''),
      ),
    )

    api.setAuthorization('Bearer qbt_example')
    await expect(api.getText('/authorization')).resolves.toBe(
      'Bearer qbt_example',
    )
    api.setAuthorization()
    await expect(api.getText('/authorization')).resolves.toBe('')
  })

  it.each([400, 401, 403, 404, 405, 409, 415])(
    'converts HTTP %s into a structured error',
    async (status) => {
      apiServer.use(
        http.get('*/api/v2/failure', () =>
          HttpResponse.json({ message: `status ${status}` }, { status }),
        ),
      )

      const error = await api.getJson('/failure').catch((reason) => reason)
      expect(error).toBeInstanceOf(QbApiError)
      expect(error).toMatchObject({
        status,
        endpoint: '/failure',
        serverMessage: `status ${status}`,
      })
    },
  )

  it.each([200, 202])(
    'accepts successful HTTP %s responses',
    async (status) => {
      apiServer.use(
        http.get('*/api/v2/success', () =>
          HttpResponse.json({ status }, { status }),
        ),
      )

      await expect(api.getJson('/success')).resolves.toEqual({ status })
    },
  )

  it('turns timeouts into errors that retain the original cause', async () => {
    apiServer.use(
      http.get('*/api/v2/slow', async () => {
        await delay(50)
        return HttpResponse.json({ ok: true })
      }),
    )
    const fastTimeoutApi = new QbApiClient('http://localhost/api/v2', 5)

    const error = await fastTimeoutApi
      .getJson('/slow')
      .catch((reason) => reason)
    expect(error).toBeInstanceOf(QbApiError)
    if (!(error instanceof QbApiError)) throw error
    expect(error).toMatchObject({ endpoint: '/slow' })
    expect(error.cause).toBeDefined()
  })
})
