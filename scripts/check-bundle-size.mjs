import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const assetDirectory = fileURLToPath(
  new URL('../dist/public/assets/', import.meta.url),
)
const maximumMainBundleBytes = 675_000
const assetNames = await readdir(assetDirectory)
const javascriptAssets = assetNames.filter((name) => name.endsWith('.js'))

if (javascriptAssets.length === 0) {
  throw new Error('No production JavaScript assets found in dist/public/assets')
}

const assets = await Promise.all(
  javascriptAssets.map(async (name) => {
    const path = join(assetDirectory, name)
    const { size } = await stat(path)
    return { name, path, size }
  }),
)
const mainBundle = assets.sort((left, right) => right.size - left.size)[0]
const gzipBytes = gzipSync(await readFile(mainBundle.path)).byteLength
const formatKilobytes = (bytes) => `${(bytes / 1000).toFixed(2)} kB`

console.log(
  `Main bundle ${basename(mainBundle.name)}: ${formatKilobytes(mainBundle.size)} ` +
    `(${formatKilobytes(gzipBytes)} gzip), limit ${formatKilobytes(maximumMainBundleBytes)}`,
)

if (mainBundle.size > maximumMainBundleBytes) {
  throw new Error(
    `Main bundle exceeds the ${formatKilobytes(maximumMainBundleBytes)} regression limit`,
  )
}
