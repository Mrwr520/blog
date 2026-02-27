import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '技术知识库',
  description: '个人技术积累与问题解决方案记录',
  lang: 'zh-CN',
  cleanUrls: true,

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/pages/categories' },
      { text: '标签', link: '/pages/tags' },
      { text: '关于', link: '/pages/about' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    footer: {
      message: '用心记录每一个技术细节',
      copyright: `© ${new Date().getFullYear()} 技术知识库`,
    },

    outline: {
      label: '目录',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
