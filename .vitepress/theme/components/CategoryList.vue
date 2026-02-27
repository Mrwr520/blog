<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ categories: Map<string, number> }>()

import { getCategoryLabel } from '../config/categories'
</script>

<template>
  <ul class="category-list">
    <li v-for="[cat, count] in categories" :key="cat">
      <a :href="withBase(`/pages/categories?category=${encodeURIComponent(cat)}`)">
        {{ getCategoryLabel(cat) }}
      </a>
      <span class="count">{{ count }}</span>
    </li>
  </ul>
</template>
