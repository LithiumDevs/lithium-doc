import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/lithium-doc/',
  title: "Lithium JS",
  description: "Frontend Framework for Lit",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Number of lessons',
        items: [
          { text: '01 - Introduction', link: '/01-introduction' },
          { text: '02 - Project Structure', link: '/02-project-structure' },
          { text: '03 - Lithium APp', link: '/03-lithium-app' },
          { text: '04 - Lithium Module', link: '/04-lithium-module' },
          { text: '05 - Lithium Page', link: '/05-lithium-page' },
          { text: '06 - Lithium Element', link: '/06-lithium-element' },
          { text: '07 - Routing', link: '/07-routing' },
          { text: '08 - Communication', link: '/08-communication' },
          { text: '09 - Optimization', link: '/09-optimization' },
          { text: '10 - Internationalization', link: '/10-internationalization' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
