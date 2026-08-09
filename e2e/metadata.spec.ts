import { expect, test } from '@playwright/test'

const torrentFixture =
  'd4:infod5:filesld6:lengthi1e4:pathl5:a.txteed6:lengthi2e4:pathl3:dir5:b.txteee4:name7:fixture12:piece lengthi16384e6:pieces20:01234567890123456789ee'
const torrentHash = 'b72ec94dda2ed6a658bafc05a20fd0afe0d658f7'

test('previews, saves, and applies file priorities before adding', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await page.getByRole('button', { name: 'Add Torrents' }).click()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'multi-file.torrent',
    mimeType: 'application/x-bittorrent',
    buffer: Buffer.from(torrentFixture),
  })

  const parseResponse = page.waitForResponse((response) =>
    response.url().endsWith('/api/v2/torrents/parseMetadata'),
  )
  await page.getByRole('button', { name: 'Preview files' }).click()
  expect((await parseResponse).ok()).toBe(true)

  const preview = page.getByRole('region', { name: 'Torrent metadata' })
  await expect(preview).toContainText('fixture')
  await expect(preview).toContainText('3 B of 3 B selected')
  await expect(preview.getByText('a.txt')).toBeVisible()
  await expect(preview.getByText('b.txt')).toBeVisible()

  await preview.getByLabel('Priority for fixture/a.txt').click()
  await page.getByRole('option', { name: 'High' }).click()
  await preview.getByLabel('Include fixture/dir/b.txt').click()
  await expect(preview).toContainText('1 B of 3 B selected')

  const saveResponse = page.waitForResponse((response) =>
    response.url().endsWith('/api/v2/torrents/saveMetadata'),
  )
  const download = page.waitForEvent('download')
  await preview.getByRole('button', { name: 'Save .torrent' }).click()
  expect((await saveResponse).ok()).toBe(true)
  expect((await download).suggestedFilename()).toBe('fixture.torrent')

  const addRequest = page.waitForRequest((request) =>
    request.url().endsWith('/api/v2/torrents/add'),
  )
  await page.getByRole('button', { name: 'Upload' }).click()
  const requestBody = (await addRequest).postData() ?? ''
  expect(requestBody).toContain('name="filePriorities"')
  expect(requestBody).toContain('6,0')
  await expect(page.getByRole('status')).toContainText(/added|processing/i)
})

test('keeps the original form available after metadata failures', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: 'Add Torrents' }).click()

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles({
    name: 'retry-fixture.torrent',
    mimeType: 'application/x-bittorrent',
    buffer: Buffer.from(torrentFixture),
  })
  let attempts = 0
  await page.route('**/api/v2/torrents/parseMetadata', async (route) => {
    attempts += 1
    await route.fulfill({
      status: 503,
      body: 'Metadata temporarily unavailable',
    })
  })

  await page.getByRole('button', { name: 'Preview files' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Metadata temporarily unavailable',
  )
  await page.getByRole('button', { name: 'Retry' }).click()
  await expect.poll(() => attempts).toBe(2)
  expect(
    await fileInput.evaluate(
      (input: HTMLInputElement) => input.files?.[0]?.name,
    ),
  ).toBe('retry-fixture.torrent')

  await page.getByRole('button', { name: 'Add directly' }).click()
  await expect(page.getByRole('status')).toContainText(
    'original input will be uploaded directly',
  )
  const addRequest = page.waitForRequest((request) =>
    request.url().endsWith('/api/v2/torrents/add'),
  )
  await page.getByRole('button', { name: 'Upload' }).click()
  const requestBody = (await addRequest).postData() ?? ''
  expect(requestBody).toContain('retry-fixture.torrent')
  expect(requestBody).not.toContain('filePriorities')
})

test('fetches link metadata already available in the server cache', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: 'Add Torrents' }).click()

  await page.locator('input[type="file"]').setInputFiles({
    name: 'cached-fixture.torrent',
    mimeType: 'application/x-bittorrent',
    buffer: Buffer.from(torrentFixture),
  })
  await page.getByRole('button', { name: 'Preview files' }).click()
  await expect(
    page.getByRole('region', { name: 'Torrent metadata' }),
  ).toContainText('fixture')

  await page.getByRole('tab', { name: 'Links' }).click()
  await page
    .getByPlaceholder('Input your torrent links...')
    .fill(`magnet:?xt=urn:btih:${torrentHash}`)
  const fetchResponse = page.waitForResponse((response) =>
    response.url().endsWith('/api/v2/torrents/fetchMetadata'),
  )
  await page.getByRole('button', { name: 'Preview files' }).click()
  expect((await fetchResponse).ok()).toBe(true)
  await expect(
    page.getByRole('region', { name: 'Torrent metadata' }),
  ).toContainText('3 B of 3 B selected')
})
