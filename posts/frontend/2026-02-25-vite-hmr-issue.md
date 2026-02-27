---
title: "【排坑】Vite HMR 热更新失效的排查与修复"
date: "2026-02-25"
category: "frontend"
tags: ["debug", "vue", "vite"]
excerpt: "Vite 开发环境下修改文件后页面不刷新，排查发现是文件路径大小写不一致导致的 HMR 失效。"
---

## 问题现象

在 Vite + Vue 3 项目中，修改 `.vue` 文件后浏览器没有热更新，控制台也没有报错。手动刷新页面后才能看到变更。

## 排查过程

1. 检查 Vite 配置，`server.hmr` 没有被禁用
2. 查看终端输出，Vite 确实检测到了文件变更
3. 打开浏览器 DevTools 的 Network 面板，发现 HMR 的 WebSocket 连接正常
4. 对比正常工作的文件和异常文件，发现 import 路径的大小写与实际文件名不一致

## 根因分析

Windows 文件系统不区分大小写，但 Vite 的 HMR 模块图是区分大小写的。当 import 路径写成 `./Components/Header.vue` 而实际文件是 `./components/Header.vue` 时，Vite 无法正确匹配模块依赖关系，导致 HMR 更新无法传播。

## 解决方案

统一所有 import 路径的大小写，与实际文件系统保持一致：

```typescript
// ❌ 错误
import Header from './Components/Header.vue'

// ✅ 正确
import Header from './components/Header.vue'
```

## 经验总结

- Windows 开发时要特别注意文件路径大小写
- 可以配置 ESLint 的 `import/no-unresolved` 规则来提前发现这类问题
- 团队协作时建议在 `.editorconfig` 或 lint 规则中统一路径命名规范
