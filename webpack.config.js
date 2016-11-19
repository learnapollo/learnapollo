const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: ['whatwg-fetch', './src'],
    css: 'tachyons',
  },
  output: {
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
      loader: 'style!css?modules!stylus',
    }, {
      test: /module\.css/,
      loader: 'style!css?modules',
    }, {
      test: /\.css/,
      exclude: /module\.css/,
      loader: 'style!css',
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
      __ENABLE_SEGMENT__: false,
      __SEGMENT_TOKEN__: '"7FHjXj58suFRzllOdSQ7Ij6a9nvYD2hS"',
      __GITHUB_OAUTH_CLIENT_ID__: '"f83113f8d6c4d78f17e5"',
      __LAMBDA_AUTH__: '"https://73zvpdo0k5.execute-api.eu-west-1.amazonaws.com/prod/lambda-learnapollo-dev_auth"',
      __LAMBDA_DOWNLOAD_EXAMPLE__: '"https://73zvpdo0k5.execute-api.eu-west-1.amazonaws.com/prod/lambda-file-processing_getting-started-example"',
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
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
  },
}
