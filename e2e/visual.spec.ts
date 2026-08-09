import { expect, test, type Page } from '@playwright/test'

async function login(page: Page) {
  await page.goto('/')
  await page.getByLabel('Username').fill('admin')
  await page
    .getByLabel('Password')
    .fill(process.env.E2E_PASSWORD ?? 'adminadmin')
  const clientDataLoaded = page.waitForResponse((response) =>
    response.url().includes('/api/v2/clientdata/load'),
  )
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('button', { name: 'Add Torrents' })).toBeVisible()
  await clientDataLoaded
  // Let the response-driven theme update commit before exercising the control.
  await page.waitForTimeout(250)
}

async function selectTheme(page: Page, target: 'light' | 'dark' | 'system') {
  const toggle = page.getByRole('button', { name: 'Toggle color theme' })

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const iconClass = await toggle.locator('svg').getAttribute('class')
    const current = iconClass?.includes('lucide-monitor')
      ? 'system'
      : iconClass?.includes('lucide-sun')
        ? 'dark'
        : 'light'
    if (current === target) return
    await toggle.click()
    await expect
      .poll(() => toggle.locator('svg').getAttribute('class'))
      .not.toBe(iconClass)
  }

  throw new Error(`Unable to select the ${target} theme`)
}

async function assertInsideViewport(page: Page, locatorName: string) {
  const locator = page.getByText(locatorName, { exact: true }).last()
  const box = await locator.boundingBox()
  const viewport = page.viewportSize()

  expect(box).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width)
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height)
}

test('themes, responsive layout, and Radix overlays render correctly', async ({
  page,
}, testInfo) => {
  const torrentName = `qb-webui-visual-${testInfo.project.name}-${Date.now()}`
  const magnet =
    `magnet:?xt=urn:btih:89abcdef0123456789abcdef0123456789abcdef` +
    `&dn=${encodeURIComponent(torrentName)}`
  let clientDataLoadCount = 0
  page.on('request', (request) => {
    if (request.url().includes('/api/v2/clientdata/load')) {
      clientDataLoadCount += 1
    }
  })

  await page.setViewportSize({ width: 1280, height: 720 })
  await login(page)
  expect(clientDataLoadCount).toBe(1)

  for (const theme of ['light', 'dark'] as const) {
    await selectTheme(page, theme)
    await expect(page.locator('html')).toHaveClass(
      theme === 'dark' ? /dark/ : /^(?!.*dark)/,
    )
    await testInfo.attach(`${testInfo.project.name}-${theme}-desktop`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    })
  }

  await page.emulateMedia({ colorScheme: 'dark' })
  await selectTheme(page, 'system')
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.getByRole('button', { name: 'Add Torrents' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await assertInsideViewport(page, 'Add Torrents')
  await page.getByRole('tab', { name: 'Links' }).click()
  await page.getByPlaceholder('Input your torrent links...').fill(magnet)
  await page.getByRole('button', { name: 'Upload' }).click()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()

  const torrentNameCell = page.getByText(torrentName, { exact: true })
  await expect(torrentNameCell).toBeVisible({ timeout: 15_000 })
  await torrentNameCell.dispatchEvent('click')

  await page.getByRole('button', { name: 'Start selected torrents' }).hover()
  await expect(page.getByRole('tooltip')).toContainText('Start Torrents')
  await assertInsideViewport(page, 'Start Torrents')

  await page.getByRole('button', { name: 'Set torrent tags' }).click()
  await expect(page.getByText('Set Tags:', { exact: true })).toBeVisible()
  await assertInsideViewport(page, 'Set Tags:')
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: 'Copy torrent data' }).click()
  await expect(page.getByRole('menu')).toBeVisible()
  await assertInsideViewport(page, 'Magnet Link')
  await page.keyboard.press('Escape')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'visible')
  await testInfo.attach(`${testInfo.project.name}-system-dark-narrow`, {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  await page.getByRole('button', { name: 'Delete selected torrents' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(torrentNameCell).toBeHidden({ timeout: 15_000 })
})
