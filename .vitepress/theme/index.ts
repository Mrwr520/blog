import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import BlogHome from './components/BlogHome.vue'
import TagsPage from './components/TagsPage.vue'
import CategoriesPage from './components/CategoriesPage.vue'
import './style/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
    app.component('TagsPage', TagsPage)
    app.component('CategoriesPage', CategoriesPage)
  },
} satisfies Theme
