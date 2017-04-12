const resolve = require('path').resolve,
      config = require('./docs.config')

module.exports = {
  head: {
    title: 'Vuency',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    'normalize.css',
    'highlight.js/styles/hybrid.css',
    { src: '~assets/sass/global.sass', lang: 'sass' }
  ],
  loading: {
    color: '#3B8070'
  },
  build: {
    extend(config, ctx) {
      // aliases
      config.resolve.alias['~articles'] = resolve(__dirname, 'articles')
      config.resolve.alias['~utilities'] = resolve(__dirname, 'utilities')
      // loaders
      config.module.rules.push({
        test: /\.md/,
        loader: 'vue-markdown-loader'
      })
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: [
      'vuency'
    ]
  },
  plugins: [
    '~plugins/vuency'
  ],
  generate: {
    routes: menuToRoutes(config.menu)
  }
}

/**
 * Convert a list of menu items to an array of dynamic route params.
 *
 * For simplicity, we ignore group headings and just create a top level route
 * for each subsection.
 */
function menuToRoutes(menu, query = 'guide') {
  let routes = []
  menu.forEach(group => {
    if (group[1] instanceof Array) group[1].forEach(subsection => routes.push(`/${query}/${subsection}`))
    else group.forEach(section => routes.push(`/${query}/${section}`))
  })
  return routes
}
