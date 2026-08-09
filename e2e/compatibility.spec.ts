import { expect, test } from '@playwright/test'

const torrentName = `qb-webui-e2e-${Date.now()}`
const magnet =
  `magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567` +
  `&dn=${encodeURIComponent(torrentName)}`

test('login, sync, filter, add, stop, start, and delete without files', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('button', { name: 'Add Torrents' })).toBeVisible()

  await page.getByRole('button', { name: 'Add Torrents' }).click()
  await page.getByRole('tab', { name: 'Links' }).click()
  await page.getByPlaceholder('Input your torrent links...').fill(magnet)
  await page.getByRole('button', { name: 'Upload' }).click()
  await expect(page.getByRole('status')).toContainText(/added|processing/i)
  await page.getByRole('button', { name: 'Close' }).click()

  const torrentNameCell = page.getByText(torrentName, { exact: true })
  await expect(torrentNameCell).toBeVisible({ timeout: 15_000 })

  const filter = page.getByRole('textbox', { name: 'Filter torrents by name' })
  await filter.fill('no-such-e2e-torrent')
  await expect(torrentNameCell).toBeHidden({ timeout: 2_000 })
  await filter.fill(torrentName)
  await expect(torrentNameCell).toBeVisible({ timeout: 2_000 })

  await torrentNameCell.click()
  const startResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      /\/api\/v2\/torrents\/(resume|start)$/.test(response.url()),
  )
  await page.getByRole('button', { name: 'Start selected torrents' }).click()
  expect((await startResponse).ok()).toBe(true)

  const stopResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      /\/api\/v2\/torrents\/(pause|stop)$/.test(response.url()),
  )
  await page.getByRole('button', { name: 'Stop selected torrents' }).click()
  expect((await stopResponse).ok()).toBe(true)

  await page.getByRole('button', { name: 'Delete selected torrents' }).click()
  const deleteFiles = page.getByLabel('Also delete the files on the hard disk')
  await expect(deleteFiles).not.toBeChecked()
  const deleteRequest = page.waitForRequest(
    (request) =>
      request.method() === 'POST' &&
      request.url().endsWith('/api/v2/torrents/delete'),
  )
  await page.getByRole('button', { name: 'Confirm' }).click()
  expect((await deleteRequest).postData()).toContain('deleteFiles=false')
  await expect(torrentNameCell).toBeHidden({ timeout: 15_000 })
})
