import { expect, test } from '@playwright/test'

const torrentFixture =
  'd4:infod5:filesld6:lengthi1e4:pathl5:a.txteed6:lengthi2e4:pathl3:dir5:b.txteee4:name7:fixture12:piece lengthi16384e6:pieces20:01234567890123456789ee'

test('renders detailed swarm data and virtualizes large peer and file sets', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await page.getByRole('button', { name: 'Add Torrents' }).click()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'details-fixture.torrent',
    mimeType: 'application/x-bittorrent',
    buffer: Buffer.from(torrentFixture),
  })
  await page.getByRole('button', { name: 'Upload' }).click()
  await expect(page.getByRole('status')).toContainText(/added|processing/i)
  await page.getByRole('button', { name: 'Close' }).click()
  const torrentName = page.getByText('fixture', { exact: true })
  await expect(torrentName).toBeVisible()

  const peers = Object.fromEntries(
    Array.from({ length: 5_000 }, (_, index) => [
      `peer-${index}`,
      index === 4_999
        ? {
            i2p_dest: 'example-destination.b32.i2p',
            host_name: `peer-${index}.example`,
            progress: 0.5,
          }
        : {
            ip: `10.${Math.floor(index / 65_536)}.${Math.floor(index / 256) % 256}.${index % 256}`,
            host_name: `peer-${index}.example`,
            port: 6_881,
            progress: index / 5_000,
          },
    ]),
  )
  await page.route('**/api/v2/sync/torrentPeers**', async (route) => {
    const rid = new URL(route.request().url()).searchParams.get('rid')
    if (rid !== '0') {
      await route.fulfill({ json: { rid: 1 } })
      return
    }
    await route.fulfill({
      json: { rid: 1, full_update: true, peers },
    })
  })

  const now = Math.floor(Date.now() / 1000)
  await page.route('**/api/v2/torrents/trackers**', (route) =>
    route.fulfill({
      json: [
        {
          url: 'https://tracker.example/announce',
          tier: 0,
          status: 5,
          msg: 'Tracker rejected the announce',
          next_announce: now + 3_600,
          min_announce: now + 1_800,
          endpoints: [
            {
              name: 'IPv6',
              status: 6,
              msg: 'Network unreachable',
              next_announce: now + 3_600,
              min_announce: now + 1_800,
            },
          ],
        },
        { url: 'https://future.example', tier: 1, status: 9 },
      ],
    }),
  )
  const files = Array.from({ length: 5_000 }, (_, index) => ({
    availability: 1,
    index,
    name: `root/file-${index}.bin`,
    piece_range: [index, index],
    priority: 1,
    progress: 0,
    size: 1,
  }))
  await page.route('**/api/v2/torrents/files**', (route) =>
    route.fulfill({ json: files }),
  )

  await torrentName.click()
  const availabilityResponse = page.waitForResponse((response) =>
    response.url().includes('/api/v2/torrents/pieceAvailability'),
  )
  await page.getByRole('button', { name: 'Expand details panel' }).click()
  await page.getByRole('tab', { name: 'General' }).click()
  expect((await availabilityResponse).ok()).toBe(true)
  await expect(
    page.getByRole('img', { name: /downloaded.*pieces/i }),
  ).toBeVisible()

  await page.getByRole('tab', { name: 'Trackers' }).click()
  const trackerTable = page.getByRole('table', { name: 'Trackers' })
  await expect(trackerTable).toContainText('Tracker error')
  await expect(trackerTable).toContainText('Unreachable')
  await expect(trackerTable).toContainText('Unknown (9)')
  await expect(trackerTable).toContainText('Network unreachable')
  await trackerTable.getByRole('checkbox', { name: 'Select row 0' }).click()
  const trackerReannounce = page.waitForRequest((request) =>
    request.url().endsWith('/api/v2/torrents/reannounce'),
  )
  await page
    .getByRole('button', { name: 'Reannounce selected trackers' })
    .click()
  expect((await trackerReannounce).postData()).toContain(
    'urls=https%3A%2F%2Ftracker.example%2Fannounce',
  )

  await page.getByRole('tab', { name: 'Peers' }).click()
  const peerTable = page.getByRole('table', { name: 'Peers' })
  await expect(peerTable).toContainText('peer-0.example')
  expect(await peerTable.getByRole('row').count()).toBeLessThan(100)
  const peerList = page.getByTestId('Peers-virtual-list')
  await peerList.evaluate((element) => {
    element.scrollTop = element.scrollHeight
    element.dispatchEvent(new Event('scroll'))
  })
  await expect(peerTable).toContainText('peer-4999.example')
  await expect(peerTable).toContainText('I2P')

  await page.getByRole('tab', { name: 'Content' }).click()
  await page.getByRole('button', { name: 'Expand root' }).click()
  const contentTable = page.getByRole('table', { name: 'Content' })
  expect(await contentTable.getByRole('row').count()).toBeLessThan(100)
  const contentList = page.getByTestId('Content-virtual-list')
  await contentList.evaluate((element) => {
    element.scrollTop = element.scrollHeight
    element.dispatchEvent(new Event('scroll'))
  })
  await expect(contentTable).toContainText('file-4999.bin')
})
