const webpack = require('webpack')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: ['whatwg-fetch', './src'],
    css: 'tachyons',
  },
  output: {
    path: './dist',
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts(x?)$/,
      loader: 'tslint',
      exclude: /node_modules/,
    }, {
      test: /module\.styl/,
      loader: 'style!css?modules!postcss!stylus',
    }, {
      test: /module\.css/,
      loader: 'style!css?modules!postcss',
    }, {
      test: /\.css/,
      exclude: /module\.css/,
      loader: 'style!css!postcss',
    }, {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel!awesome-typescript',
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
    }, {
      test: /\.json/,
      loader: 'json',
    }, {
      test: /\.(jpg|png)/,
      loader: 'file',
    }, {
      test: /content\/.*\.svg$/,
      loader: 'file',
    }, {
      test: /icons\/.*\.svg$/,
      loader: 'raw!svgo?{"plugins":[{"removeStyleElement":true}]}',
    }, {
      test: /\.md/,
      loader: 'raw',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      __LAST_UPDATE__: '"' + new Date().toLocaleDateString() + '"',
      __GA_TRACKING_CODE__: '"UA-74131346-6"',
      __GITHUB_OAUTH_CLIENT_ID__: JSON.stringify(process.env.GITHUB_OAUTH_CLIENT_ID.toString()),
      __LAMBDA_AUTH__: JSON.stringify(process.env.LAMBDA_AUTH.toString()),
      __LAMBDA_DOWNLOAD_EXAMPLE__: '"https://73zvpdo0k5.execute-api.eu-west-1.amazonaws.com/prod/lambda-file-processing_getting-started-example"',
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnano({
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll: true,
            },
            safe: true,
          })
        ],
        svgo: {
          plugins: [
            {removeStyleElement: true},
          ],
        },
      }
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  }
}
