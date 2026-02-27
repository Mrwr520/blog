export interface PostData {
  title: string
  url: string
  date: string
  category: string
  tags: string[]
  excerpt: string
}

/** 按日期倒序排序（最新在前） */
export function sortByDate(posts: PostData[]): PostData[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

/** 按分类筛选 */
export function filterByCategory(posts: PostData[], category: string): PostData[] {
  return posts.filter((p) => p.category === category)
}

/** 按标签筛选 */
export function filterByTag(posts: PostData[], tag: string): PostData[] {
  return posts.filter((p) => p.tags.includes(tag))
}

/** 分页 */
export function paginate(
  posts: PostData[],
  page: number,
  pageSize: number,
): { items: PostData[]; totalPages: number; currentPage: number } {
  const safePage = Math.max(1, page)
  const safeSize = Math.max(1, pageSize)
  const totalPages = Math.max(1, Math.ceil(posts.length / safeSize))
  const clampedPage = Math.min(safePage, totalPages)
  const start = (clampedPage - 1) * safeSize
  return {
    items: posts.slice(start, start + safeSize),
    totalPages,
    currentPage: clampedPage,
  }
}

/** 提取所有标签及计数 */
export function getAllTags(posts: PostData[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    }
  }
  return map
}

/** 提取所有分类及计数 */
export function getAllCategories(posts: PostData[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const post of posts) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1)
  }
  return map
}

/** 解析 frontmatter 为 PostData（用于验证） */
export function parseFrontmatter(frontmatter: Record<string, unknown>): PostData {
  return {
    title: typeof frontmatter.title === 'string' ? frontmatter.title : '',
    url: typeof frontmatter.url === 'string' ? frontmatter.url : '',
    date: typeof frontmatter.date === 'string' ? frontmatter.date : '',
    category: typeof frontmatter.category === 'string' ? frontmatter.category : 'other',
    tags: Array.isArray(frontmatter.tags)
      ? frontmatter.tags.filter((t): t is string => typeof t === 'string')
      : [],
    excerpt: typeof frontmatter.excerpt === 'string' ? frontmatter.excerpt : '',
  }
}
