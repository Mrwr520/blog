<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { data as posts } from '../utils/posts.data.mts'
import { getAllTags, filterByTag } from '../utils/helpers'
import ArticleList from './ArticleList.vue'

const selectedTag = ref<string | null>(null)
const tags = computed(() => getAllTags(posts))
const filteredPosts = computed(() =>
  selectedTag.value ? filterByTag(posts, selectedTag.value) : posts,
)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const tag = params.get('tag')
  if (tag) selectedTag.value = tag
})

function selectTag(tag: string | null) {
  selectedTag.value = tag
  const url = new URL(window.location.href)
  if (tag) {
    url.searchParams.set('tag', tag)
  } else {
    url.searchParams.delete('tag')
  }
  window.history.replaceState({}, '', url.toString())
}
</script>

<template>
  <div class="tags-page">
    <h1>🏷️ 标签</h1>
    <div class="tag-cloud" style="margin-bottom: 24px;">
      <a
        class="tag"
        :style="{ opacity: !selectedTag ? 1 : 0.6, cursor: 'pointer' }"
        @click="selectTag(null)"
      >
        全部 ({{ posts.length }})
      </a>
      <a
        v-for="[tag, count] in tags"
        :key="tag"
        class="tag"
        :style="{ opacity: selectedTag === tag ? 1 : 0.6, cursor: 'pointer' }"
        @click="selectTag(tag)"
      >
        {{ tag }} ({{ count }})
      </a>
    </div>
    <ArticleList :posts="filteredPosts" />
  </div>
</template>
