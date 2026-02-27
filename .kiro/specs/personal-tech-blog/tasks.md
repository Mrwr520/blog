# 个人技术博客知识库 - 任务列表

## 1. 项目初始化与基础配置
- [x] 1.1 初始化 VitePress 项目，安装依赖（vitepress, vue, typescript），配置 package.json scripts
- [x] 1.2 创建 `.vitepress/config.mts` 主配置文件（站点标题、导航栏、搜索、Markdown 选项）
- [x] 1.3 创建项目目录结构（posts/frontend、posts/backend、posts/devops、posts/other、pages/、public/images、templates/）

## 2. 数据层与工具函数
- [x] 2.1 创建 `.vitepress/theme/utils/posts.data.mts` 文章数据加载器
- [x] 2.2 创建 `.vitepress/theme/utils/helpers.ts` 工具函数（sortByDate、filterByCategory、filterByTag、paginate、getAllTags、getAllCategories）
- [x] 2.3 安装测试依赖（vitest, fast-check），配置 vitest.config.ts
- [x] 2.4 编写 helpers.ts 的属性测试
  - [x] 2.4.1 属性测试：文章排序正确性（属性 1）
  - [x] 2.4.2 属性测试：分类筛选完整性与正确性（属性 2）
  - [x] 2.4.3 属性测试：标签筛选完整性与正确性（属性 3）
  - [x] 2.4.4 属性测试：分页一致性（属性 4）
  - [x] 2.4.5 属性测试：Frontmatter 解析完整性（属性 5）

## 3. 主题扩展与自定义样式
- [x] 3.1 创建 `.vitepress/theme/index.ts` 主题入口文件，扩展默认主题并注册自定义组件
- [x] 3.2 创建 `.vitepress/theme/style/custom.css` 自定义样式（CSS 变量、卡片、响应式）

## 4. Vue 组件开发
- [x] 4.1 创建 `ArticleCard.vue` 文章卡片组件
- [x] 4.2 创建 `ArticleList.vue` 文章列表组件（含分页）
- [x] 4.3 创建 `TagCloud.vue` 标签云组件
- [x] 4.4 创建 `CategoryList.vue` 分类列表组件
- [x] 4.5 创建 `BlogHome.vue` 博客首页布局组件

## 5. 页面与内容模板
- [x] 5.1 创建 `index.md` 首页（使用 BlogHome 布局）
- [x] 5.2 创建 `pages/tags.md` 标签页和 `pages/categories.md` 分类页
- [x] 5.3 创建 `pages/about.md` 关于页
- [x] 5.4 创建 AI 友好的文章模板体系（templates/ 目录下多种模板：排坑记、技术选型、学习笔记、Prompt 库）
- [x] 5.5 创建 2-3 篇示例文章验证整体功能

## 6. 部署配置
- [x] 6.1 创建 `.github/workflows/deploy.yml` GitHub Actions 自动部署工作流
- [x] 6.2 配置 `.vitepress/config.mts` 中的 `base` 路径适配 GitHub Pages
