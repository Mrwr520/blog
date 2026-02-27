<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ categories: Map<string, number> }>()

const categoryLabel: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  devops: 'DevOps',
  other: '其他',
}
</script>

<template>
  <ul class="category-list">
    <li v-for="[cat, count] in categories" :key="cat">
      <a :href="withBase(`/pages/categories?category=${encodeURIComponent(cat)}`)">
        {{ categoryLabel[cat] ?? cat }}
      </a>
      <span class="count">{{ count }}</span>
    </li>
  </ul>
</template>
