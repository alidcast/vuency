var resolve = require('path').resolve
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var projectRoot = resolve(__dirname, './')
var srcRoot = resolve(__dirname, './src')
var testRoot = resolve(__dirname, './test')
var devRoot = resolve(__dirname, './examples')
var prodRoot = resolve(__dirname, './dist')

const baseConfig = {
  resolve: {
    extensions: [ // automatically resolve certain extensions
      '.js', '.vue'
    ],
    alias: { // create an alias for commonly used modules
      'vue$': 'vue/dist/vue.common.js', // vue standalone build
      'src': srcRoot
    },
    modules: [ // directory to search when resolving modules
      srcRoot, "node_modules"
    ]
  },
  module: {
    rules: [ // specify how module is created
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [srcRoot, testRoot],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: projectRoot,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}

const devConfig = {
    entry: `${devRoot}/main.js`,
    output: {
      publicPath: '/'
    },
    devtool: '#eval-source-map',
    performance: { hints: false },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: `${devRoot}/index.html`,
        inject: true
      })
    ]
}

const prodConfig = {
  entry: `${srcRoot}/index.js`,
  output: {
    path: prodRoot,
    publicPath: '/dist/',
    filename: 'build.js',
    library: 'vueMobiledocEditor',
    libraryTarget: 'umd'
  },
  externals: {
    vue: 'vue'
  },
  devtool: '#source-map',
  plugins: (baseConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

var finalConfig

if (process.env.NODE_ENV === 'development') {
  finalConfig = merge(baseConfig, devConfig)
}
else if (process.env.NODE_ENV === 'production') {
  finalConfig = merge(baseConfig, prodConfig)
}
else if (process.env.NODE_ENV === 'testing') {
  finalConfig = merge(baseConfig, testConfig)
  // no need for original entry during tests
  delete finalConfig.entry
}
else {
  throw 'Node environment does not exist'
}

module.exports = finalConfig
