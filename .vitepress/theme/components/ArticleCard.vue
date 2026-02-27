<script setup lang="ts">
import { withBase } from 'vitepress'

interface Props {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  excerpt: string
}

defineProps<Props>()

import { getCategoryLabel } from '../config/categories'
</script>

<template>
  <article class="article-card">
    <h2 class="card-title">
      <a :href="withBase(url)">{{ title }}</a>
    </h2>
    <div class="card-meta">
      <time>{{ date }}</time>
      <span>·</span>
      <span>{{ getCategoryLabel(category) }}</span>
    </div>
    <p v-if="excerpt" class="card-excerpt">{{ excerpt }}</p>
    <div v-if="tags.length" style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </article>
</template>
