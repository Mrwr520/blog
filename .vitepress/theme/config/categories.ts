/**
 * 分类配置
 * 新增分类只需在这里添加一行即可，页面会自动识别
 * key: frontmatter 中的 category 值
 * value: 页面上显示的中文名
 */
export const categoryLabels: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  devops: 'DevOps',
  other: '其他',
  // 新增分类示例：
  // database: '数据库',
  // ai: '人工智能',
  // mobile: '移动端',
}

/** 获取分类显示名，未配置的分类直接显示原始值 */
export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category
}
