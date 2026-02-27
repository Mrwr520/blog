<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { data as posts } from '../utils/posts.data.mts'
import { getAllCategories, filterByCategory } from '../utils/helpers'
import { getCategoryLabel } from '../config/categories'
import ArticleList from './ArticleList.vue'

const selectedCategory = ref<string | null>(null)
const categories = computed(() => getAllCategories(posts))
const filteredPosts = computed(() =>
  selectedCategory.value ? filterByCategory(posts, selectedCategory.value) : posts,
)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const cat = params.get('category')
  if (cat) selectedCategory.value = cat
})

function selectCategory(cat: string | null) {
  selectedCategory.value = cat
  const url = new URL(window.location.href)
  if (cat) {
    url.searchParams.set('category', cat)
  } else {
    url.searchParams.delete('category')
  }
  window.history.replaceState({}, '', url.toString())
}
</script>

<template>
  <div class="categories-page">
    <h1>📂 分类</h1>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
      <button
        :style="{
          padding: '6px 16px',
          borderRadius: '8px',
          border: '1px solid var(--blog-card-border)',
          background: !selectedCategory ? 'var(--vp-c-brand-soft)' : 'var(--blog-card-bg)',
          color: 'var(--vp-c-text-1)',
          cursor: 'pointer',
        }"
        @click="selectCategory(null)"
      >
        全部 ({{ posts.length }})
      </button>
      <button
        v-for="[cat, count] in categories"
        :key="cat"
        :style="{
          padding: '6px 16px',
          borderRadius: '8px',
          border: '1px solid var(--blog-card-border)',
          background: selectedCategory === cat ? 'var(--vp-c-brand-soft)' : 'var(--blog-card-bg)',
          color: 'var(--vp-c-text-1)',
          cursor: 'pointer',
        }"
        @click="selectCategory(cat)"
      >
        {{ getCategoryLabel(cat) }} ({{ count }})
      </button>
    </div>
    <ArticleList :posts="filteredPosts" />
  </div>
</template>
