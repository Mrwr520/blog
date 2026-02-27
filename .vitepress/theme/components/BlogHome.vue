<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../utils/posts.data.mts'
import { getAllTags, getAllCategories, sortByDate } from '../utils/helpers'
import ArticleList from './ArticleList.vue'
import TagCloud from './TagCloud.vue'
import CategoryList from './CategoryList.vue'

const sortedPosts = computed(() => sortByDate(posts))
const tags = computed(() => getAllTags(posts))
const categories = computed(() => getAllCategories(posts))
</script>

<template>
  <div class="blog-home">
    <main>
      <ArticleList :posts="sortedPosts" />
    </main>
    <aside class="blog-sidebar">
      <div class="sidebar-section">
        <h3>📂 分类</h3>
        <CategoryList :categories="categories" />
      </div>
      <div class="sidebar-section">
        <h3>🏷️ 标签</h3>
        <TagCloud :tags="tags" />
      </div>
    </aside>
  </div>
</template>
