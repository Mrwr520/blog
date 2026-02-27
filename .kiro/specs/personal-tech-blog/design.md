# 个人技术博客知识库 - 设计文档

## 概述
基于 VitePress 构建个人技术知识库，采用 Markdown 驱动内容管理，扩展默认主题实现博客风格布局。项目结构清晰，便于 AI 工具直接生成 Markdown 文件发布内容。

## 技术栈
- VitePress（最新稳定版 1.x）
- Vue 3 + TypeScript
- CSS 自定义变量（扩展 VitePress 默认主题）
- VitePress 内置本地搜索（minisearch）
- GitHub Actions（CI/CD）

## 项目结构

```
/
├── .vitepress/
│   ├── config.mts              # VitePress 主配置
│   ├── theme/
│   │   ├── index.ts            # 主题入口，扩展默认主题
│   │   ├── style/
│   │   │   └── custom.css      # 自定义样式变量和覆盖
│   │   ├── components/
│   │   │   ├── BlogHome.vue    # 博客首页组件（文章列表+侧边栏）
│   │   │   ├── ArticleList.vue # 文章列表组件（含分页）
│   │   │   ├── TagCloud.vue    # 标签云组件
│   │   │   ├── CategoryList.vue# 分类列表组件
│   │   │   └── ArticleCard.vue # 文章卡片组件
│   │   └── utils/
│   │       ├── posts.data.mts  # 文章数据加载器（createContentLoader）
│   │       └── helpers.ts      # 工具函数（排序、筛选、分页）
├── posts/                      # 文章目录（按分类子目录组织）
│   ├── frontend/
│   ├── backend/
│   ├── devops/
│   └── other/
├── pages/
│   ├── tags.md                 # 标签页
│   ├── categories.md           # 分类页
│   └── about.md                # 关于页
├── public/                     # 静态资源
│   └── images/
├── templates/
│   └── post-template.md        # AI 生成文章模板
├── index.md                    # 首页（使用自定义 BlogHome 布局）
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages 部署工作流
```

## 核心设计

### 1. 数据层 - 文章数据加载器

使用 VitePress 的 `createContentLoader` API 在构建时提取所有文章的 frontmatter 元数据。

**文件**: `.vitepress/theme/utils/posts.data.mts`

```typescript
import { createContentLoader } from 'vitepress'

export interface PostData {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  excerpt: string
}

export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  transform(rawData): PostData[] {
    return rawData
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date,
        category: frontmatter.category || 'other',
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt || excerpt || '',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})
```

### 2. 工具函数层

**文件**: `.vitepress/theme/utils/helpers.ts`

提供纯函数用于文章数据的排序、筛选和分页：

```typescript
// 按日期倒序排序
export function sortByDate(posts: PostData[]): PostData[]

// 按分类筛选
export function filterByCategory(posts: PostData[], category: string): PostData[]

// 按标签筛选
export function filterByTag(posts: PostData[], tag: string): PostData[]

// 分页
export function paginate(posts: PostData[], page: number, pageSize: number): {
  items: PostData[]
  totalPages: number
  currentPage: number
}

// 提取所有标签及计数
export function getAllTags(posts: PostData[]): Map<string, number>

// 提取所有分类及计数
export function getAllCategories(posts: PostData[]): Map<string, number>
```

### 3. 组件层

#### BlogHome.vue
博客首页布局组件，使用 VitePress 的 `page` layout slot：
- 左侧：文章列表（ArticleList）
- 右侧侧边栏：分类列表 + 标签云

#### ArticleCard.vue
单篇文章卡片，展示：标题、日期、分类、标签、摘要

#### ArticleList.vue
文章列表 + 分页控件，接收筛选后的文章数组

#### TagCloud.vue
标签云组件，展示所有标签及文章数量，点击跳转筛选

#### CategoryList.vue
分类列表组件，展示所有分类及文章数量

### 4. 主题扩展

**文件**: `.vitepress/theme/index.ts`

```typescript
import DefaultTheme from 'vitepress/theme'
import BlogHome from './components/BlogHome.vue'
import './style/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
  }
}
```

### 5. AI 友好的文章模板体系

在 `templates/` 目录下提供多种场景化模板，AI 生成时根据场景选择对应模板：

#### 5.1 排坑记模板 (`templates/debug-record.md`)
适用于记录疑难杂症的 Debug 过程。
```yaml
---
title: "【排坑】问题简述"
date: "YYYY-MM-DD"
category: "frontend"
tags: ["debug", "相关技术"]
excerpt: "一句话描述问题和解决方案"
---
## 问题现象
## 排查过程
## 根因分析
## 解决方案
## 经验总结
```

#### 5.2 技术选型模板 (`templates/tech-decision.md`)
适用于记录业务场景下的技术选型思考。
```yaml
---
title: "【选型】场景简述"
date: "YYYY-MM-DD"
category: "frontend"
tags: ["architecture", "相关技术"]
excerpt: "一句话描述选型结论"
---
## 业务场景
## 候选方案对比
## 最终选择与理由
## 落地效果
```

#### 5.3 学习笔记模板 (`templates/learning-note.md`)
适用于技术知识点的学习记录。
```yaml
---
title: "【笔记】知识点名称"
date: "YYYY-MM-DD"
category: "frontend"
tags: ["learning", "相关技术"]
excerpt: "一句话描述核心知识点"
---
## 核心概念
## 代码示例
## 实际应用场景
## 参考链接
```

#### 5.4 Prompt 库模板 (`templates/prompt-collection.md`)
适用于沉淀 AI 辅助开发的 Prompt 经验。
```yaml
---
title: "【Prompt】场景简述"
date: "YYYY-MM-DD"
category: "other"
tags: ["ai", "prompt"]
excerpt: "一句话描述 Prompt 用途"
---
## 使用场景
## Prompt 内容
## 使用效果
## 优化迭代记录
```

所有模板共享统一的 frontmatter 规范：
```yaml
---
title: string      # 必填
date: string       # 必填，格式 YYYY-MM-DD
category: string   # 必填，frontend | backend | devops | other
tags: string[]     # 必填
excerpt: string    # 必填，用于列表展示
---
```

### 6. 自定义样式

**文件**: `.vitepress/theme/style/custom.css`

覆盖 VitePress CSS 变量实现自定义配色：
- 主色调：柔和的蓝色系
- 圆角卡片设计
- 优化代码块样式
- 响应式断点适配

### 7. VitePress 配置

**文件**: `.vitepress/config.mts`

关键配置项：
- `title` / `description`：站点标题和描述
- `themeConfig.nav`：导航栏（首页、分类、标签、关于）
- `themeConfig.search`：启用本地搜索
- `themeConfig.socialLinks`：GitHub 链接
- `markdown`：代码行号、代码复制按钮

### 8. GitHub Actions 部署

**文件**: `.github/workflows/deploy.yml`

触发条件：push 到 main 分支
步骤：checkout → 安装依赖 → 构建 → 部署到 GitHub Pages

## AI 内容生成策略

为了让 AI 工具（如 Kiro）能便捷地生成文章：

1. **模板驱动**：`templates/post-template.md` 作为标准模板，AI 只需填充内容
2. **目录约定**：文章放在 `posts/{category}/` 下，文件名使用 `YYYY-MM-DD-slug.md` 格式
3. **Frontmatter 规范**：严格定义必填字段，AI 生成时自动填充
4. **无需额外配置**：新增 `.md` 文件后，VitePress 构建时自动识别，无需修改任何配置文件

## 正确性属性

### 属性 1：文章排序正确性
**验证需求 1.1**
对于任意文章集合，`sortByDate` 函数返回的结果中，每篇文章的日期应大于等于其后一篇文章的日期。
```
∀ posts: PostData[], i: number where 0 ≤ i < sortByDate(posts).length - 1:
  sortByDate(posts)[i].date >= sortByDate(posts)[i+1].date
```

### 属性 2：分类筛选完整性与正确性
**验证需求 1.2**
对于任意文章集合和分类名，`filterByCategory` 返回的结果应满足：
- 结果中每篇文章的 category 等于指定分类
- 原集合中所有属于该分类的文章都在结果中
```
∀ posts: PostData[], category: string:
  let result = filterByCategory(posts, category)
  result.every(p => p.category === category) ∧
  posts.filter(p => p.category === category).length === result.length
```

### 属性 3：标签筛选完整性与正确性
**验证需求 1.2**
对于任意文章集合和标签名，`filterByTag` 返回的结果应满足：
- 结果中每篇文章的 tags 包含指定标签
- 原集合中所有包含该标签的文章都在结果中
```
∀ posts: PostData[], tag: string:
  let result = filterByTag(posts, tag)
  result.every(p => p.tags.includes(tag)) ∧
  posts.filter(p => p.tags.includes(tag)).length === result.length
```

### 属性 4：分页一致性
**验证需求 1.1**
对于任意文章集合和分页参数，分页结果应满足：
- 所有页的文章总数等于原集合总数
- 每页文章数不超过 pageSize
- totalPages 计算正确
```
∀ posts: PostData[], pageSize: number > 0:
  let allPages = [1..totalPages].flatMap(p => paginate(posts, p, pageSize).items)
  allPages.length === posts.length ∧
  ∀ page: paginate(posts, page, pageSize).items.length ≤ pageSize
```

### 属性 5：Frontmatter 解析完整性
**验证需求 3.1**
对于任意合法的 frontmatter 数据，解析后的 PostData 应包含所有必要字段且类型正确。
```
∀ frontmatter with required fields:
  parsed.title is string ∧
  parsed.date is valid date string ∧
  parsed.category is string ∧
  parsed.tags is string[]
```

## 测试框架
- 单元测试：Vitest
- 属性测试：fast-check（配合 Vitest）
