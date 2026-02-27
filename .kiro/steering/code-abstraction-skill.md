---
inclusion: manual
---

# AI 代码抽象与通用化 Skill

## 核心原则

你是一个高级前端工程师，不是代码翻译机。AI 生成的代码是"初稿"，你的职责是 Code Review、抽象、组合和交付。

## 一、拿到 AI 生成代码后的标准流程

### Step 1：先审后用，不要直接粘贴

- 通读 AI 生成的代码，理解它的实现思路
- 检查是否有硬编码、魔法数字、业务耦合
- 确认是否符合项目现有的代码规范和架构约定

### Step 2：识别"可抽象点"

问自己三个问题：
1. 这段逻辑在项目里是否已经存在类似实现？→ 如果是，合并而不是新增
2. 这段逻辑未来会不会在其他模块复用？→ 如果是，抽成通用函数/组件/Hook
3. 这段逻辑的输入输出是否可以参数化？→ 如果是，提取配置项

### Step 3：执行抽象

按照下面的抽象层级，从低到高逐步提炼：

```
具体实现 → 参数化函数 → 通用工具/Hook → 可配置组件 → 业务无关的库
```

不要一步到位追求"终极抽象"，够用就行，过度抽象比不抽象更危险。

## 二、抽象的具体手法

### 2.1 函数级抽象

把重复的逻辑提取为纯函数，放到 `utils/` 或 `helpers/` 目录。

规范：
- 函数必须是纯函数（相同输入 → 相同输出，无副作用）
- 参数用 TypeScript 接口约束，不要用 any
- 函数名要表达"做什么"而不是"怎么做"
- 单个函数不超过 30 行，超过就拆

```typescript
// ❌ 不好：硬编码业务逻辑
function formatStockPrice(price: number) {
  return `¥${price.toFixed(2)}`
}

// ✅ 好：参数化，通用
function formatCurrency(value: number, options?: {
  currency?: string
  decimals?: number
}): string {
  const { currency = '¥', decimals = 2 } = options ?? {}
  return `${currency}${value.toFixed(decimals)}`
}
```

### 2.2 组件级抽象（Vue/React）

把重复的 UI 模式提取为通用组件。

规范：
- Props 定义清晰，必填和可选分明
- 用 slot/children 处理内容变化，不要用 v-if 堆条件
- 样式用 CSS 变量或 props 控制，不要写死
- 组件只关心"展示"，业务逻辑通过 props/events 传入

```vue
<!-- ❌ 不好：业务耦合 -->
<template>
  <div class="stock-card">
    <h3>{{ stock.name }}</h3>
    <span :class="stock.change > 0 ? 'red' : 'green'">
      {{ stock.change }}%
    </span>
  </div>
</template>

<!-- ✅ 好：通用数据卡片 -->
<template>
  <div class="data-card">
    <h3>{{ title }}</h3>
    <span :class="statusClass">
      <slot name="value" />
    </span>
  </div>
</template>
```

### 2.3 Hook/Composable 级抽象

把重复的状态逻辑提取为 Composable（Vue）或 Custom Hook（React）。

适用场景：
- 分页逻辑 → `usePagination`
- 搜索防抖 → `useDebounceSearch`
- 列表筛选 → `useFilter`
- 表单校验 → `useFormValidation`
- 请求状态管理 → `useRequest`

```typescript
// 通用分页 Composable
function usePagination<T>(items: Ref<T[]>, pageSize = 10) {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.ceil(items.value.length / pageSize))
  const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })
  return { currentPage, totalPages, pagedItems }
}
```

### 2.4 配置驱动抽象

当多个页面/模块结构相似但数据不同时，用配置驱动渲染。

```typescript
// 用配置描述表格，而不是每个页面写一遍
const tableConfig: ColumnConfig[] = [
  { key: 'name', label: '名称', width: 200 },
  { key: 'status', label: '状态', render: (val) => statusMap[val] },
  { key: 'date', label: '日期', format: 'YYYY-MM-DD' },
]
```

## 三、业务脱敏规范

从公司项目抽象出通用方案时，必须脱敏：

1. 去掉所有真实业务名称、接口地址、数据字段名
2. 用通用领域替代（如"股票"→"数据项"，"交易"→"操作"）
3. 代码示例用自己写的 Demo，不贴公司源码
4. 重点描述"方法论"和"架构思路"，而不是具体实现

## 四、AI 辅助抽象的 Prompt 模板

当你想让 AI 帮你抽象代码时，使用以下 Prompt 结构：

```
我有一段 [语言/框架] 代码，实现了 [功能描述]。
请帮我：
1. 识别其中可以抽象为通用逻辑的部分
2. 提取为参数化的纯函数/组件/Hook
3. 给出 TypeScript 类型定义
4. 保持接口简洁，不要过度设计

约束：
- 项目使用 [Vue 3 / React] + TypeScript
- 遵循 [项目的代码规范，如有]
- 抽象层级不超过 2 层

代码如下：
[粘贴代码]
```

## 五、Code Review 自检清单

每次抽象完成后，对照检查：

- [ ] 函数/组件是否有清晰的 TypeScript 类型定义？
- [ ] 是否消除了硬编码和魔法数字？
- [ ] 是否有合理的默认值，调用方可以零配置使用？
- [ ] 是否有单元测试覆盖核心逻辑？
- [ ] 命名是否表达意图而非实现细节？
- [ ] 是否避免了过度抽象（抽象层级 ≤ 2）？
- [ ] 是否与项目现有的工具函数/组件库有重复？
- [ ] 是否做了业务脱敏（如果要沉淀到个人博客）？

## 六、目录组织建议

```
src/
├── utils/          # 纯函数工具（与框架无关）
├── composables/    # Vue Composables / React Hooks
├── components/
│   ├── base/       # 基础通用组件（Button, Card, Modal...）
│   └── business/   # 业务组件（由基础组件组合而成）
├── config/         # 配置驱动的声明式定义
└── types/          # 共享类型定义
```

## 七、什么时候不该抽象

- 只用了一次，且短期内不会复用 → 不抽
- 两个实现看起来像但业务语义完全不同 → 不抽
- 抽象后调用方的代码反而更复杂 → 不抽
- 需求还在频繁变动 → 等稳定了再抽
