import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const modulesDir = path.join(projectRoot, '功能模块设计包')

function scanModules() {
  const dirs = fs.readdirSync(modulesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  return dirs.map(d => {
    const mDir = path.join(modulesDir, d.name)
    const files = fs.readdirSync(mDir)
    const name = d.name.replace(/^\d+_/, '')
    const mdFiles = files.filter(f => f.endsWith('.md') && !f.endsWith('_预览.md'))
    const previewFiles = files.filter(f => f.endsWith('_预览.md'))
    const htmlFiles = files.filter(f => f.endsWith('.html'))

    const targets = []
    for (const f of [...mdFiles, ...htmlFiles]) {
      if (f.includes('后台管理端')) targets.push('admin')
      if (f.includes('客户端')) targets.push('client')
      if (f.includes('微信小程序')) targets.push('mini')
    }

    return { dir: d.name, name, mdFiles, previewFiles, htmlFiles, targets: [...new Set(targets)] }
  })
}

const modules = scanModules()

function buildSidebar() {
  return [
    {
      text: '车管家 · 功能模块',
      collapsed: false,
      items: modules.map(m => {
        const items = []
        for (const md of m.mdFiles) {
          const label = md.includes('功能设计') ? '设计文档' : (md.includes('后台管理端') ? '后台管理端设计' : (md.includes('客户端') ? '客户端设计' : (md.includes('微信小程序') ? '小程序设计' : '设计文档')))
          const url = '/功能模块设计包/' + m.dir + '/' + md.replace('.md', '')
          items.push({ text: 'document   ' + label, link: url })
        }
        for (const pf of m.previewFiles) {
          let label = 'preview  '
          if (pf.includes('后台管理端')) label += '后台管理端原型'
          else if (pf.includes('客户端')) label += '客户端原型'
          else if (pf.includes('微信小程序')) label += '微信小程序原型'
          else label += '原型预览'
          const url = '/功能模块设计包/' + m.dir + '/' + pf.replace('.md', '')
          items.push({ text: label, link: url })
        }
        return { text: m.dir.replace(/_/g, ' '), collapsed: true, items }
      })
    },
    { text: 'changelog', link: '/变更历史' }
  ]
}

export default defineConfig({
  title: '车管家 原型系统',
  description: '连云港汽车后市场综合服务平台',
  lang: 'zh-CN',
  lastUpdated: true,
  ignoreDeadLinks: true,
  srcDir: projectRoot,
  cleanUrls: false,
  themeConfig: {
    siteTitle: 'car admin prototypes',
    nav: [
      { text: 'home', link: '/' },
      { text: 'modules', link: '#modules' },
      { text: 'changelog', link: '/变更历史' }
    ],
    sidebar: buildSidebar(),
    footer: {
      message: 'car admin prototype system internal use only',
      copyright: 'Copyright ' + new Date().getFullYear() + ' cheguanjia team'
    },
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    lastUpdatedText: 'last updated',
    docFooter: { prev: 'prev', next: 'next' }
  },
  vite: {
    assetsInclude: ['**/*.html']
  }
})