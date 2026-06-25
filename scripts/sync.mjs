import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const modulesDir = path.join(projectRoot, '功能模块设计包')
const publicDir = path.join(projectRoot, '.vitepress', 'public', 'prototypes')

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

const dirs = fs.readdirSync(modulesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name))

for (const d of dirs) {
  const mDir = path.join(modulesDir, d.name)
  const files = fs.readdirSync(mDir)
  const htmlFiles = files.filter(f => f.endsWith('.html'))
  const outDir = path.join(publicDir, d.name)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  for (const f of htmlFiles) {
    fs.copyFileSync(path.join(mDir, f), path.join(outDir, f))
  }
}
console.log('OK Prototypes synced')