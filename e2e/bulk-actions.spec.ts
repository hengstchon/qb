import { expect, test, type Page, type Request } from '@playwright/test'

const requestCollector = (page: Page, endpoint: string) => {
  const requests: Request[] = []
  const listener = (request: Request) => {
    if (request.url().endsWith(`/api/v2/torrents/${endpoint}`)) {
      requests.push(request)
    }
  }
  page.on('request', listener)
  return {
    requests,
    stop: () => page.off('request', listener),
  }
}

test('runs compatible batch actions and reports partial failures', async ({
  page,
}) => {
  test.setTimeout(60_000)
  const suffix = Date.now()
  const names = [`qb-bulk-a-${suffix}`, `qb-bulk-b-${suffix}`]
  const magnets = [
    `magnet:?xt=urn:btih:1111111111111111111111111111111111111111&dn=${names[0]}`,
    `magnet:?xt=urn:btih:2222222222222222222222222222222222222222&dn=${names[1]}`,
  ]

  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText(/\d+ selected/)).toHaveCount(0)

  await page.getByRole('button', { name: 'Add Torrents' }).click()
  await page.getByRole('tab', { name: 'Links' }).click()
  await page
    .getByPlaceholder('Input your torrent links...')
    .fill(magnets.join('\n'))
  await page.getByRole('button', { name: 'Upload' }).click()
  await expect(page.getByRole('status')).toContainText(/added|processing/i)
  await page.getByRole('button', { name: 'Close' }).click()

  const firstTorrent = page.getByText(names[0], { exact: true })
  const secondTorrent = page.getByText(names[1], { exact: true })
  await expect(firstTorrent).toBeVisible({ timeout: 15_000 })
  await expect(secondTorrent).toBeVisible({ timeout: 15_000 })
  await firstTorrent.click()
  await expect(page.getByText('1 selected')).toBeVisible()
  await secondTorrent.click({ modifiers: ['Meta'] })
  await expect(page.getByText('2 selected')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Recheck selected torrents' }),
  ).toBeEnabled()

  let categoryAttempt = 0
  await page.route('**/api/v2/torrents/setCategory', async (route) => {
    categoryAttempt += 1
    await route.fulfill(
      categoryAttempt === 1
        ? { status: 204 }
        : { status: 409, body: 'Incorrect category name' },
    )
  })
  await page.getByRole('button', { name: 'Set torrent category' }).click()
  await page.getByLabel('Set category').click()
  await page.getByRole('option', { name: 'Uncategorized' }).click()
  await page.getByRole('button', { name: 'Apply category' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'Set category: 1 succeeded, 1 failed.',
  )
  await expect(page.getByRole('alert')).toContainText('Incorrect category name')
  await page.keyboard.press('Escape')
  await page.unroute('**/api/v2/torrents/setCategory')

  const createTagResponse = await page.request.post(
    `${process.env.E2E_BASE_URL}/api/v2/torrents/createTags`,
    { form: { tags: 'bulk-e2e' } },
  )
  expect(createTagResponse.ok()).toBe(true)
  const tagRequests = requestCollector(page, 'addTags')
  await page.getByRole('button', { name: 'Set torrent tags' }).click()
  await page.getByRole('combobox', { name: 'Select tags...' }).click()
  await expect(page.getByRole('option', { name: 'bulk-e2e' })).toBeVisible({
    timeout: 10_000,
  })
  await page.getByRole('option', { name: 'bulk-e2e' }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Apply tags' }).click()
  await expect.poll(() => tagRequests.requests.length).toBe(2)
  expect(
    tagRequests.requests.every((request) =>
      request.postData()?.includes('tags=bulk-e2e'),
    ),
  ).toBe(true)
  tagRequests.stop()
  await page.keyboard.press('Escape')

  const uploadRequests = requestCollector(page, 'setUploadLimit')
  const shareRequests = requestCollector(page, 'setShareLimits')
  await page.getByRole('button', { name: 'Set torrent limits' }).click()
  await page.getByLabel('Upload rate (B/s)').fill('1024')
  await page.getByLabel('Share ratio').fill('2')
  const shareAction = page.getByLabel('Limit action')
  if (process.env.E2E_PROFILE === 'qb523') {
    await expect(shareAction).toBeVisible()
    await shareAction.click()
    await page.getByRole('option', { name: 'Stop torrent' }).click()
  } else {
    await expect(shareAction).toHaveCount(0)
  }
  await page.getByRole('button', { name: 'Apply limits' }).click()
  await expect.poll(() => uploadRequests.requests.length).toBe(2)
  await expect.poll(() => shareRequests.requests.length).toBe(2)
  for (const request of shareRequests.requests) {
    const body = request.postData() ?? ''
    if (process.env.E2E_PROFILE === 'qb523') {
      expect(body).toContain('shareLimitAction=Stop')
      expect(body).toContain('inactiveSeedingTimeLimit=-2')
    } else {
      expect(body).not.toContain('shareLimitAction')
      expect(body).not.toContain('inactiveSeedingTimeLimit')
    }
  }
  uploadRequests.stop()
  shareRequests.stop()
  await page.keyboard.press('Escape')

  if (process.env.E2E_PROFILE === 'qb523') {
    await page.getByRole('button', { name: 'Set torrent limits' }).click()
    await page.getByLabel('Limit action').click()
    await page.getByRole('option', { name: 'Remove torrent and data' }).click()
    await expect(page.getByText(/permanently delete its data/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Apply limits' }),
    ).toBeDisabled()
    await page.getByLabel('I understand this destructive action').click()
    await expect(
      page.getByRole('button', { name: 'Apply limits' }),
    ).toBeEnabled()
    await page.keyboard.press('Escape')
  }

  const locationRequests = requestCollector(page, 'setLocation')
  await page.getByRole('button', { name: 'Set torrent location' }).click()
  await page.getByLabel('Location:').fill('/downloads')
  await page.getByRole('button', { name: 'Move torrents' }).click()
  await expect.poll(() => locationRequests.requests.length).toBe(2)
  locationRequests.stop()
  await page.keyboard.press('Escape')

  const recheckRequests = requestCollector(page, 'recheck')
  await page.getByRole('button', { name: 'Recheck selected torrents' }).click()
  await expect.poll(() => recheckRequests.requests.length).toBe(2)
  recheckRequests.stop()
  const reannounceRequests = requestCollector(page, 'reannounce')
  await page
    .getByRole('button', { name: 'Reannounce selected torrents' })
    .click()
  await expect.poll(() => reannounceRequests.requests.length).toBe(2)
  expect(
    reannounceRequests.requests.every(
      (request) => !(request.postData() ?? '').includes('urls='),
    ),
  ).toBe(true)
  reannounceRequests.stop()
})
