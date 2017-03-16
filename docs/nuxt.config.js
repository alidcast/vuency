const resolve = require('path').resolve

module.exports = {
  head: {
    title: 'starter',
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
    extend (config, ctx) {
      // aliases
      config.resolve.alias['~articles'] = resolve(__dirname, 'articles')
      config.resolve.alias['~utilities'] = resolve(__dirname, 'utilities')
      // loaders
      config.module.rules.push(
      {
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
    routeParams: {
      '/guide/:slug': toRouteParams([
        'introduction',
        'managing-concurrency',
      ]),
      '/examples/:slug': toRouteParams([
        'controlling-state'
      ]),
    }
  }
}

/**
 * Convert an array of url slugs to an array of dynamic route params.
 */
function toRouteParams(params, query = 'slug') {
  let routes = []
  params.forEach(param => {
    routes.push({ [query]: param })
  })
  return routes
}
