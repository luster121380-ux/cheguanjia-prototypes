---
layout: home

hero:
  name: 🚗 车管家
  text: 产品设计原型系统
  tagline: 连云港汽车后市场综合服务平台 · 设计文档与交互原型

  actions:
    - theme: brand
      text: 📋 浏览功能模块
      link: '#modules'
    - theme: alt
      text: 📋 变更历史
      link: /变更历史

features:
  - icon: 🧩
    title: 7 个功能模块
    details: 涵盖透明车间、优惠套餐、客户钱包、机器人租赁等核心业务。
  - icon: 📝
    title: 设计文档 + 交互原型
    details: 每个模块包含完整的设计说明和高保真 HTML 原型。
  - icon: 🔗
    title: 在线协作
    details: 一个 URL 直达最新版，告别微信传文件和版本混乱。
  - icon: 🕐
    title: 版本可溯
    details: Git 管理所有变更，每次修改有记录、可回滚。
---

## <span id="modules">📋 功能模块总览</span>

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin: 20px 0;">

  <ModuleCard 
    title="01 · 透明车间" 
    desc="客户通过小程序实时查看车辆维修进度，后台管理维修工单与进度上报。"
    doc="/功能模块设计包/01_透明车间/01_透明车间_后台管理端"
    admin="/功能模块设计包/01_透明车间/01_透明车间_后台管理端_预览"
    mini="/功能模块设计包/01_透明车间/02_透明车间_微信小程序_预览"
    status="✅ 已完成"
  />

  <ModuleCard 
    title="02 · 优惠套餐" 
    desc="后台配置优惠套餐与满减活动，客户端展示并支持用户购买下单。"
    doc="/功能模块设计包/02_优惠套餐/01_优惠套餐_功能设计文档"
    admin="/功能模块设计包/02_优惠套餐/01_优惠套餐_后台管理端_预览"
    status="✅ 已完成"
  />

  <ModuleCard 
    title="03 · 客户钱包管理" 
    desc="客户钱包余额管理、充值、消费记录查询，后台资金流水对账。"
    doc="/功能模块设计包/03_客户钱包管理/03_客户钱包管理_后台管理端"
    admin="/功能模块设计包/03_客户钱包管理/03_客户钱包管理_后台管理端_预览"
    client="/功能模块设计包/03_客户钱包管理/03_客户钱包管理_客户端_预览"
    status="✅ 已完成"
  />

  <ModuleCard 
    title="04 · 主题化" 
    desc="商城/客户端主题配置，支持节日氛围换肤，后台配置主题活动。"
    doc="/功能模块设计包/04_主题化/04_主题化_功能设计文档"
    admin="/功能模块设计包/04_主题化/04_主题化_后台管理端_预览"
    status="✅ 已完成"
  />

  <ModuleCard 
    title="05 · 布局调整" 
    desc="首页金刚区功能入口布局优化调整，提升用户操作效率。"
    admin="/功能模块设计包/05_布局调整/05_布局调整_后台管理端_预览"
    status="✅ 已完成"
  />

  <ModuleCard 
    title="06 · 车辆年检排队" 
    desc="微信小程序年检排队预约，查看排队进度与通知。"
    mini="/功能模块设计包/06_车辆年检排队/06_车辆年检排队_微信小程序_预览"
    status="✅ 已完成"
  />

  <ModuleCard 
    title="07 · 机器人租赁 🆕" 
    desc="平台维护可租赁机器人信息，处理微信小程序提交的租赁订单。"
    doc="/功能模块设计包/07_机器人租赁/07_机器人租赁_后台管理端"
    admin="/功能模块设计包/07_机器人租赁/07_机器人租赁_后台管理端_预览"
    mini="/功能模块设计包/07_机器人租赁/07_机器人租赁_微信小程序_预览"
    status="🆕 新增需求"
  />

</div>

<script setup>
import { defineComponent, h } from 'vue'

const ModuleCard = defineComponent({
  props: ['title', 'desc', 'doc', 'admin', 'mini', 'client', 'status'],
  setup(props) {
    return () => h('div', { 
      style: 'border:1px solid #e5e6eb; border-radius:12px; padding:20px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.04); transition:all .2s; hover:box-shadow 0 4px 16px rgba(0,0,0,.08)'
    }, [
      h('div', { style: 'display:flex; justify-content:space-between; align-items:start; margin-bottom:10px' }, [
        h('h3', { style: 'margin:0; font-size:16px; font-weight:600; color:#1d2129' }, props.title),
        h('span', { 
          style: props.status?.includes('🆕') 
            ? 'font-size:12px; background:rgba(22,93,255,.1); color:#165dff; padding:2px 8px; border-radius:4px' 
            : 'font-size:12px; background:rgba(0,180,42,.1); color:#00b42a; padding:2px 8px; border-radius:4px'
        }, props.status)
      ]),
      props.desc ? h('p', { style: 'margin:0 0 14px; color:#4e5969; font-size:13px; line-height:1.6' }, props.desc) : null,
      h('div', { style: 'display:flex; gap:8px; flex-wrap:wrap' }, [
        props.doc ? h('a', { href: props.doc, style: 'text-decoration:none; font-size:12px; color:#165dff; background:rgba(22,93,255,.06); padding:4px 10px; border-radius:4px' }, '📄 设计文档') : null,
        props.admin ? h('a', { href: props.admin, style: 'text-decoration:none; font-size:12px; color:#165dff; background:rgba(22,93,255,.06); padding:4px 10px; border-radius:4px' }, '🖥️ 后台管理端') : null,
        props.client ? h('a', { href: props.client, style: 'text-decoration:none; font-size:12px; color:#165dff; background:rgba(22,93,255,.06); padding:4px 10px; border-radius:4px' }, '📱 客户端') : null,
        props.mini ? h('a', { href: props.mini, style: 'text-decoration:none; font-size:12px; color:#165dff; background:rgba(22,93,255,.06); padding:4px 10px; border-radius:4px' }, '📱 微信小程序') : null,
      ])
    ])
  }
})
</script>
