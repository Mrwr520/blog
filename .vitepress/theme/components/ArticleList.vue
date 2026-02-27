<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleCard from './ArticleCard.vue'
import { paginate, type PostData } from '../utils/helpers'

const props = withDefaults(defineProps<{ posts: PostData[]; pageSize?: number }>(), {
  pageSize: 10,
})

const currentPage = ref(1)

const paged = computed(() => paginate(props.posts, currentPage.value, props.pageSize))

function prev() {
  if (currentPage.value > 1) currentPage.value--
}

function next() {
  if (currentPage.value < paged.value.totalPages) currentPage.value++
}
</script>

<template>
  <div class="article-list">
    <template v-if="paged.items.length">
      <ArticleCard
        v-for="post in paged.items"
        :key="post.url"
        v-bind="post"
      />
    </template>
    <p v-else style="color: var(--blog-text-secondary); text-align: center; padding: 40px 0;">
      暂无文章
    </p>

    <div v-if="paged.totalPages > 1" class="pagination">
      <button :disabled="currentPage <= 1" @click="prev">上一页</button>
      <span class="page-info">{{ paged.currentPage }} / {{ paged.totalPages }}</span>
      <button :disabled="currentPage >= paged.totalPages" @click="next">下一页</button>
    </div>
  </div>
</template>
