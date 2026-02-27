import { createContentLoader } from 'vitepress'

export interface PostData {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  excerpt: string
}

export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  transform(rawData): PostData[] {
    return rawData
      .filter(({ url }) => !url.endsWith('.gitkeep'))
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title ?? '',
        url,
        date: frontmatter.date ?? '',
        category: frontmatter.category ?? 'other',
        tags: frontmatter.tags ?? [],
        excerpt: frontmatter.excerpt ?? excerpt ?? '',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})
