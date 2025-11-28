# VitePress 功能增强套件

> 一站式 VitePress 文档增强解决方案，集自动导航生成、侧边栏构建、资源容错、图片交互、断链检测、缓存优化等能力于一体，帮助团队快速搭建高可维护性的知识库或开发文档。

- **主要定位**：为 VitePress 提供更智能的文档工程体验，避免重复造轮子。
- **适用场景**：中大型知识库、团队开发文档、课程/教程站点、多语言技术站点。
- **支持版本**：VitePress `^1.0.0`，Node.js `>=18`.

---

## 目录

1. [快速上手](#快速上手)
2. [功能矩阵](#功能矩阵)
3. [架构与目录结构](#架构与目录结构)
4. [使用指南](#使用指南)
5. [配置详解](#配置详解)
6. [脚本与 CLI](#脚本与-cli)
7. [最佳实践](#最佳实践)
8. [FAQ](#faq)
9. [贡献指南](#贡献指南)
10. [许可证](#许可证)

---

## 快速上手

```bash
git clone <your-repo-url>
cd vitepress-enhancer
npm install
npm run docs:dev
```

`docs/.vitepress/config.mts` 已预置全部增强功能，无需二次集成。若你已有 VitePress 项目，可直接复制 `docs/.vitepress` 目录并按需调整。

---

## 功能矩阵

| 类别         | 能力概述                                                                 | 亮点                                                                 |
| ------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| 导航/侧边栏  | 自动扫描目录生成多级导航与侧栏，支持概述页、排序、隐藏、图标、命名等     | 同时支持 `_meta.json` 与 frontmatter，零手动维护                     |
| 元数据系统   | 目录/文件级别的元数据，同步控制导航、侧栏、标题、图标、折叠策略等       | 支持递归继承，可扩展字段                                             |
| 资源容错     | 缺失资源占位符插件确保构建过程不因断链或缺图失败                         | 以显著样式提示缺失资源，方便排查                                     |
| 图片增强     | 基于 `medium-zoom` 的放大效果，默认作用于所有 Markdown 图片              | 提供 `no-zoom` escape class，保留灵活性                              |
| 断链检测     | 可选的链接验证脚本，输出详细报表                                         | 结合路径建议，减少历史文档迁移成本                                   |
| 缓存系统     | 文件扫描、标题提取等过程全局缓存                                         | 可视化统计、手动清理、性能可配置                                     |
| 日志与诊断   | 统一的 logger，输出关键步骤与性能开销                                    | 便于集成 CI/CD，快速定位问题                                         |

---

## 架构与目录结构

```
docs/.vitepress/
├── config.mts                  # 主配置：集中启用所有功能
├── autoGenerateNavSidebar.mjs  # 对外导出 generateNav / generateSidebar 等工具
├── plugins/
│   └── handle-missing-assets.mjs  # 缺失资源占位符 Vite 插件
├── theme/
│   ├── index.ts               # medium-zoom 及主题扩展入口
│   └── style.css              # 放大浮层及动画样式
└── utils/
    ├── cache/                 # 缓存控制与统计
    ├── config/                # 路径常量、元数据解析
    ├── file/                  # 文件读写、过滤、排序
    ├── logger/                # 结构化日志
    ├── nav/                   # 导航生成核心
    ├── sidebar/               # 侧边栏生成核心
    ├── text/                  # 字符串与 URL 工具
    └── validator/             # 断链检测工具（可按需启用）
```

`autoGenerateNavSidebar.mjs` 将主要能力统一导出，既能兼容旧版引入方式，也便于在脚本中复用。

---

## 使用指南

### 1. 导航 / 侧边栏自动生成

```ts
// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'
import { generateNav, generateSidebar } from './autoGenerateNavSidebar.mjs'

export default defineConfig({
  themeConfig: {
    nav: generateNav({
      maxDepth: 3,
      addOverview: true,
      overviewText: '📋 概述'
    }),
    sidebar: generateSidebar({
      maxDepth: 5,
      useTitle: true,
      collapsed: false
    })
  }
})
```

- **maxDepth**：控制扫描目录深度，防止过深层级。
- **addOverview**：在每个目录补充概述页，提升可读性。
- **useTitle**：优先使用文档一级标题作为侧栏标题。

### 2. 元数据驱动的可见性与展示

| 类型   | 文件                   | 典型字段                                                                |
| ------ | ---------------------- | ----------------------------------------------------------------------- |
| 目录   | `docs/guide/_meta.json` | `title`, `icon`, `order`, `nav.hidden`, `sidebar.hidden`, `collapsed`   |
| 单页   | Markdown frontmatter    | `sidebar.title`, `sidebar.icon`, `nav.order`, `draft`, `badge` 等自定义 |

```json
{
  "title": "AI 系列",
  "icon": "🤖",
  "nav": { "hidden": false },
  "sidebar": { "hidden": false, "order": 10 }
}
```

```markdown
---
title: Docker 系列
nav:
  icon: "🐳"
sidebar:
  hidden: true
---
```

### 3. 缺失资源占位符

- 插件路径：`docs/.vitepress/plugins/handle-missing-assets.mjs`
- 行为：在构建或 `docs:dev` 时拦截 404 静态资源，返回占位组件，避免产物缺失。
- 自定义：可根据业务替换默认占位 SVG 或提示文案。

### 4. 图片点击放大

- 入口：`docs/.vitepress/theme/index.ts`
- 样式：`docs/.vitepress/theme/style.css`
- 关闭单图放大：`![desc](path){ .no-zoom }`

### 5. 缓存管理

```ts
import { setCacheConfig, getCacheStats, clearCache } from './utils/cache'

setCacheConfig({ maxSize: 200 })
console.table(getCacheStats())
clearCache()
```

> 建议在 CI 过程中输出 `getCacheStats()`，监控性能瓶颈。

### 6. 断链检测（可选）

```bash
# docs/.vitepress/check-links.mjs
node docs/.vitepress/check-links.mjs --report
```

输出示例：

```
❌ 发现 12 个断链：
  - java/Java学习笔记.md 第 149 行: E:\target\java\2.4.1变量的本质.png
    原因: 使用了绝对路径
    建议: target/java/2.4.1变量的本质.png
```

可通过 CLI 参数控制 `maxDepth`、重试次数、是否生成 JSON 报告。

---

## 配置详解

| 功能           | 入口文件                            | 关键选项                         | 说明                                                                 |
| -------------- | ----------------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| 导航生成       | `utils/nav/generator.mjs`           | `maxDepth`, `addOverview`        | 支持排序、概述页、隐藏、图标等                                       |
| 侧边栏生成     | `utils/sidebar/generator.mjs`       | `maxDepth`, `useTitle`, `collapsed` | 支持多级折叠、frontmatter 标题、排序                                |
| 元数据解析     | `utils/config/metaResolver.mjs`     | `fallbackTitle`, `iconResolver`  | 自动合并 `_meta.json` 与 frontmatter                                |
| 缓存           | `utils/cache`                       | `MAX_SIZE`, `ENABLE_*_CACHE`     | 可按模块开启/关闭缓存                                                |
| 缺失资源占位符 | `plugins/handle-missing-assets.mjs` | `placeholderPath`, `logLevel`    | 自定义占位内容、是否输出日志                                         |
| medium-zoom    | `theme/index.ts`                    | `selector`, `background`, `margin` | 默认 selector 为 `.main img:not(.no-zoom)`                          |
| 断链检测       | `utils/validator`                   | `maxDepth`, `generateReport`     | 支持导出 JSON/Markdown 报告，便于 CI 接入                            |

---

## 脚本与 CLI

`package.json` 推荐脚本：

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "docs:check": "node docs/.vitepress/check-links.mjs"
  }
}
```

- `docs:dev`：本地开发预览，热更新全部功能。
- `docs:build`：生成静态站点，可于 CI 中运行。
- `docs:check`：断链检测，建议与构建流程串联。

### CI/CD 示例（GitHub Actions）

```yaml
name: Docs CI
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm docs:check
      - run: pnpm docs:build
```

---

## 最佳实践

1. **目录即导航**：所有文档均对应真实文件夹，避免在配置里手动维护链接。
2. **显式排序**：为核心章节添加 `order` 字段，确保多语言/多人协作时顺序一致。
3. **定期断链**：在 `pre-commit` 或 CI 中执行 `docs:check`，防止图片/附件缺失。
4. **缓存监控**：大型站点建议在构建日志中打印 `getCacheStats()`，便于排查性能。
5. **渐进式引入**：已有项目可以先启用导航/侧栏生成功能，再逐步接入其他插件。

---

## FAQ

**Q: 是否支持不同语言目录独立配置？**  
A: 可以。不同语言目录能定义各自 `_meta.json`，`generateNav/Sidebar` 会按语言根目录拆分生成。

**Q: 如何禁用部分功能？**  
A: 在 `config.mts` 中移除对应插件/调用即可。例如不想使用缺失资源占位符，可从 `vitepress` 插件列表删除 `handleMissingAssetsPlugin()`。

**Q: 旧项目如何迁移？**  
A: 将 `docs/.vitepress` 覆盖到旧项目中，然后执行 `npm install`. 若已有自定义配置，可在 `config.mts` 中合并或对比差异。

**Q: 能否与现有 Vite/Vue 插件共存？**  
A: 可以，延续 VitePress 官方配置方式；内部插件不会污染全局命名空间。

---

## 贡献指南

1. Fork 仓库并新建分支，例如 `feat/awesome-module`.
2. 运行 `npm run docs:dev` 验证行为。
3. 为新增功能补充文档/注释/示例。
4. 提交 PR，并描述动机、重现、测试结果。

欢迎通过 Issue/Discussion 反馈路线图需求（如多语言导航、可视化编辑器、脚手架等）。

---

## 许可证

MIT License（若需其他协议，可在此处说明）。

---

如需更多定制示例（多语言、排序策略、脚本化生成等），欢迎提 Issue 或 PR。祝你使用愉快 🚀