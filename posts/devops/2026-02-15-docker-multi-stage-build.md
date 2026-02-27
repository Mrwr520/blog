---
title: "【笔记】Docker 多阶段构建优化前端镜像体积"
date: "2026-02-15"
category: "devops"
tags: ["docker", "learning", "performance"]
excerpt: "使用 Docker 多阶段构建将前端项目镜像从 1.2GB 压缩到 25MB。"
---

## 核心概念

Docker 多阶段构建允许在一个 Dockerfile 中使用多个 `FROM` 指令，每个 `FROM` 开始一个新的构建阶段。最终镜像只包含最后一个阶段的内容，前面阶段的构建工具和中间产物都会被丢弃。

## 代码示例

```dockerfile
# 阶段 1：构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 阶段 2：运行
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## 实际应用场景

- 前端项目的 CI/CD 流水线中，构建生产镜像
- 需要控制镜像体积的场景（如 K8s 部署，镜像拉取速度很重要）
- 任何需要编译/构建步骤的项目

## 参考链接

- [Docker 官方文档 - Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
