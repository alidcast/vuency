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
    ''
  ],
  loading: {
    color: '#3B8070'
  },
  build: {
    extend (config, ctx) {
      // aliases
      config.resolve.alias['~documentation'] = resolve(__dirname, 'documentation')
      config.resolve.alias['~examples'] = resolve(__dirname, 'examples')
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
  ]
  // ,
  // generate: {
  //   routeParams: {
  //     '/guide/:lesson': function() {
  //       return compsToRouteParams('lesson', [
  //         'introduction'
  //       ])
  //     }
  //   }
  // }
}

// /**
//  * Components to Route Params
//  * @param {String} param - param to be used as object key
//  * @param {Object} comps - exported components
//  * @returns {Array} route params
//  */
// module.exports = function componentToRouteParams(query, params) {
//   let routes = []
//   for (let i = 0; i <= params.length - 1; i++) {
//     routes.push({ [query]: params[i] })
//   }
//   return routes
// }
