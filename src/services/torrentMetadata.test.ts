import { describe, expect, it, vi } from 'vitest'
import {
  fetchTorrentMetadata,
  parseTorrentMetadata,
  saveTorrentMetadata,
} from './torrentMetadata'

const metadata = {
  hash: 'abc',
  infohash_v1: 'abc',
  infohash_v2: '',
  info: {
    files: [{ path: 'file.txt', length: 1 }],
    length: 1,
    name: 'fixture',
    piece_length: 16_384,
    pieces_num: 1,
    private: false,
  },
}

describe('torrent metadata API', () => {
  it('polls fetchMetadata until metadata becomes ready', async () => {
    const api = {
      postForm: vi.fn().mockResolvedValueOnce({}).mockResolvedValue(metadata),
      postMultipart: vi.fn(),
    }

    await expect(
      fetchTorrentMetadata('magnet:?xt=urn:btih:abc', api, {
        attempts: 2,
        intervalMs: 0,
      }),
    ).resolves.toEqual(metadata)
    expect(api.postForm).toHaveBeenCalledTimes(2)
  })

  it('parses uploaded torrent files in request order', async () => {
    const file = new File(['torrent'], 'fixture.torrent')
    const api = {
      postForm: vi.fn(),
      postMultipart: vi.fn().mockResolvedValue([metadata]),
    }

    await expect(parseTorrentMetadata([file], api)).resolves.toEqual([metadata])
    expect(api.postMultipart).toHaveBeenCalledWith(
      '/torrents/parseMetadata',
      { torrents: [file] },
      'json',
    )
  })

  it('downloads cached metadata as a torrent blob', async () => {
    const blob = new Blob(['torrent'])
    const api = {
      postForm: vi.fn().mockResolvedValue(blob),
      postMultipart: vi.fn(),
    }

    await expect(saveTorrentMetadata('abc', api)).resolves.toBe(blob)
    expect(api.postForm).toHaveBeenCalledWith(
      '/torrents/saveMetadata',
      { source: 'abc' },
      'blob',
    )
  })
})
