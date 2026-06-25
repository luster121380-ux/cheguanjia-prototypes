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
          const label = md.includes('功能设计') ? '📄 设计文档' : (md.includes('后台管理端') ? '🖥 后台管理端' : (md.includes('客户端') ? '📱 客户端' : (md.includes('微信小程序') ? '📱 小程序' : '📄 文档')))
          const url = '/cheguanjia-prototypes/功能模块设计包/' + m.dir + '/' + md.replace('.md', '')
          items.push({ text: label, link: url })
        }
        for (const pf of m.previewFiles) {
          let label = '🖥️ '
          if (pf.includes('后台管理端')) label += '后台管理端原型'
          else if (pf.includes('客户端')) label += '客户端原型'
          else if (pf.includes('微信小程序')) label += '微信小程序原型'
          else label += '原型预览'
          const url = '/cheguanjia-prototypes/功能模块设计包/' + m.dir + '/' + pf.replace('.md', '')
          items.push({ text: label, link: url })
        }
        return { text: m.dir.replace(/_/g, ' '), collapsed: true, items }
      })
    },
    { text: '📋 变更历史', link: '/cheguanjia-prototypes/变更历史' }
  ]
}

export default defineConfig({
  base: '/cheguanjia-prototypes/',
  title: '车管家 · 原型系统',
  description: '连云港汽车后市场综合服务平台',
  lang: 'zh-CN',
  lastUpdated: true,
  ignoreDeadLinks: true,
  srcDir: projectRoot,
  cleanUrls: false,
  themeConfig: {
    siteTitle: '🚗 车管家',
    logo: false,
    nav: [
      { text: '🏠 首页', link: '/cheguanjia-prototypes/' },
      { text: '📋 功能模块', link: '/cheguanjia-prototypes/#modules' },
      { text: '📋 变更历史', link: '/cheguanjia-prototypes/变更历史' }
    ],
    sidebar: buildSidebar(),
    footer: {
      message: '车管家 · 产品设计原型系统 — 仅供内部协作使用',
      copyright: 'Copyright © ' + new Date().getFullYear() + ' 车管家项目组'
    },
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    lastUpdatedText: '最后更新',
    docFooter: { prev: '上一页', next: '下一页' }
  },
  vite: {
    assetsInclude: ['**/*.html']
  }
})