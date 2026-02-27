import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  sortByDate,
  filterByCategory,
  filterByTag,
  paginate,
  parseFrontmatter,
  type PostData,
} from './helpers'

// --- Generator ---

const CATEGORIES = ['frontend', 'backend', 'devops', 'other'] as const
const SAMPLE_TAGS = ['vue', 'react', 'node', 'docker', 'typescript', 'css', 'debug', 'ai']

const arbDate = fc
  .tuple(
    fc.integer({ min: 2020, max: 2026 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 }),
  )
  .map(([y, m, d]) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)

const arbPost: fc.Arbitrary<PostData> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 50 }),
  url: fc.webUrl(),
  date: arbDate,
  category: fc.constantFrom(...CATEGORIES),
  tags: fc.uniqueArray(fc.constantFrom(...SAMPLE_TAGS), { minLength: 0, maxLength: 4 }),
  excerpt: fc.string({ maxLength: 100 }),
})

const arbPosts = fc.array(arbPost, { minLength: 0, maxLength: 30 })

// --- 属性测试 ---

describe('helpers - property-based tests', () => {
  /**
   * 属性 1：文章排序正确性
   * **Validates: Requirements 1.1**
   */
  it('sortByDate: 结果按日期倒序排列', () => {
    fc.assert(
      fc.property(arbPosts, (posts) => {
        const sorted = sortByDate(posts)
        for (let i = 0; i < sorted.length - 1; i++) {
          expect(new Date(sorted[i].date).getTime())
            .toBeGreaterThanOrEqual(new Date(sorted[i + 1].date).getTime())
        }
      }),
    )
  })

  /**
   * 属性 2：分类筛选完整性与正确性
   * **Validates: Requirements 1.2**
   */
  it('filterByCategory: 结果仅包含指定分类且不遗漏', () => {
    fc.assert(
      fc.property(arbPosts, fc.constantFrom(...CATEGORIES), (posts, category) => {
        const result = filterByCategory(posts, category)
        // 正确性：结果中每篇都属于该分类
        expect(result.every((p) => p.category === category)).toBe(true)
        // 完整性：数量一致
        const expected = posts.filter((p) => p.category === category)
        expect(result.length).toBe(expected.length)
      }),
    )
  })

  /**
   * 属性 3：标签筛选完整性与正确性
   * **Validates: Requirements 1.2**
   */
  it('filterByTag: 结果仅包含指定标签且不遗漏', () => {
    fc.assert(
      fc.property(arbPosts, fc.constantFrom(...SAMPLE_TAGS), (posts, tag) => {
        const result = filterByTag(posts, tag)
        // 正确性
        expect(result.every((p) => p.tags.includes(tag))).toBe(true)
        // 完整性
        const expected = posts.filter((p) => p.tags.includes(tag))
        expect(result.length).toBe(expected.length)
      }),
    )
  })

  /**
   * 属性 4：分页一致性
   * **Validates: Requirements 1.1**
   */
  it('paginate: 所有页合并后等于原数组，每页不超过 pageSize', () => {
    fc.assert(
      fc.property(
        arbPosts,
        fc.integer({ min: 1, max: 20 }),
        (posts, pageSize) => {
          const { totalPages } = paginate(posts, 1, pageSize)

          // 收集所有页的 items
          const allItems: PostData[] = []
          for (let p = 1; p <= totalPages; p++) {
            const { items } = paginate(posts, p, pageSize)
            // 每页不超过 pageSize
            expect(items.length).toBeLessThanOrEqual(pageSize)
            allItems.push(...items)
          }

          // 总数一致
          expect(allItems.length).toBe(posts.length)
        },
      ),
    )
  })

  /**
   * 属性 5：Frontmatter 解析完整性
   * **Validates: Requirements 3.1**
   */
  it('parseFrontmatter: 解析后包含所有必要字段且类型正确', () => {
    const arbFrontmatter = fc.record({
      title: fc.string({ minLength: 1 }),
      date: arbDate,
      category: fc.constantFrom(...CATEGORIES),
      tags: fc.array(fc.constantFrom(...SAMPLE_TAGS)),
      excerpt: fc.string(),
      url: fc.webUrl(),
    })

    fc.assert(
      fc.property(arbFrontmatter, (fm) => {
        const parsed = parseFrontmatter(fm)
        expect(typeof parsed.title).toBe('string')
        expect(parsed.title.length).toBeGreaterThan(0)
        expect(typeof parsed.date).toBe('string')
        expect(/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)).toBe(true)
        expect(typeof parsed.category).toBe('string')
        expect(Array.isArray(parsed.tags)).toBe(true)
        parsed.tags.forEach((t) => expect(typeof t).toBe('string'))
      }),
    )
  })
})
