import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const outDir = path.join(root, 'public', 'media')

const jobs = [
  {
    key: 'hero-cachorro',
    input: path.join(root, 'assents', 'cachorro.jpg'),
    widths: [480, 720, 960, 1024],
  },
  {
    key: 'portfolio-toby',
    input: path.join(root, 'assents', 'toby.jpg'),
    widths: [320, 480, 640, 800],
  },
  {
    key: 'portfolio-olaff',
    input: path.join(root, 'assents', 'olaff.jpg'),
    widths: [320, 480, 640, 800],
  },
  {
    key: 'portfolio-kodyepudim',
    input: path.join(root, 'assents', 'kodyepudim.jpg'),
    widths: [320, 480, 640, 800],
  },
  {
    key: 'portfolio-paty',
    input: path.join(root, 'assents', 'paty.jpg'),
    widths: [320, 480, 640, 800],
  },
  {
    key: 'logo-brand',
    input: path.join(root, 'assents', 'logo2.png'),
    widths: [112, 168, 224],
    formats: ['webp'],
  },
]

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function optimizeJob(job) {
  const image = sharp(job.input)
  const meta = await image.metadata()
  const maxWidth = meta.width ?? Math.max(...job.widths)

  const validWidths = job.widths.filter((w) => w <= maxWidth)
  const outputs = []

  const formats = job.formats ?? ['avif', 'webp', 'jpg']

  for (const width of validWidths) {
    const base = path.join(outDir, `${job.key}-${width}`)

    if (formats.includes('avif')) {
      const avifPath = `${base}.avif`
      await sharp(job.input)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 48, effort: 4 })
        .toFile(avifPath)
      outputs.push(avifPath)
    }

    if (formats.includes('webp')) {
      const webpPath = `${base}.webp`
      await sharp(job.input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 74, effort: 4 })
        .toFile(webpPath)
      outputs.push(webpPath)
    }

    if (formats.includes('jpg')) {
      const jpgPath = `${base}.jpg`
      await sharp(job.input)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 74, mozjpeg: true, progressive: true })
        .toFile(jpgPath)
      outputs.push(jpgPath)
    }
  }

  return outputs
}

async function run() {
  await fs.rm(outDir, { recursive: true, force: true })
  await ensureDir(outDir)

  const generated = []
  for (const job of jobs) {
    const files = await optimizeJob(job)
    generated.push(...files)
  }

  generated.sort()
  console.log(`Generated ${generated.length} files in ${path.relative(root, outDir)}`)
  for (const file of generated) {
    const stat = await fs.stat(file)
    console.log(`${path.relative(root, file)} - ${(stat.size / 1024).toFixed(1)} KiB`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
