<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ tags: Map<string, number> }>()
</script>

<template>
  <div class="tag-cloud">
    <a
      v-for="[tag, count] in tags"
      :key="tag"
      :href="withBase(`/pages/tags?tag=${encodeURIComponent(tag)}`)"
      class="tag"
      :title="`${count} 篇文章`"
    >
      {{ tag }} ({{ count }})
    </a>
  </div>
</template>
