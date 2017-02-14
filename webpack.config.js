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
      loader: 'tslint-loader',
      exclude: /node_modules/,
    }, {
      test: /module\.styl/,
      loader: 'style-loader!css-loader?modules!stylus-loader',
    }, {
      test: /module\.css/,
      loader: 'style-loader!css-loader?modules',
    }, {
      test: /\.css/,
      exclude: /module\.css/,
      loader: 'style-loader!css-loader',
    }, {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel-loader!awesome-typescript-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.json/,
      loader: 'json-loader',
    }, {
      test: /\.(jpg|png)/,
      loader: 'file-loader',
    }, {
      test: /content\/.*\.svg$/,
      loader: 'file-loader',
    }, {
      test: /icons\/.*\.svg$/,
      loader: 'raw-loader!svgo-loader?{"plugins":[{"removeStyleElement":true}]}',
    }, {
      test: /\.md/,
      loader: 'raw-loader',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      __LAST_UPDATE__: '"' + new Date().toLocaleDateString() + '"',
      __GA_TRACKING_CODE__: '"UA-74131346-6"',
      __GITHUB_OAUTH_CLIENT_ID__: '"f83113f8d6c4d78f17e5"',
      __LAMBDA_AUTH__: '"https://73zvpdo0k5.execute-api.eu-west-1.amazonaws.com/prod/lambda-learnapollo-dev_auth"',
      __LAMBDA_DOWNLOAD_EXAMPLE__: '"https://qtkqo6so2i.execute-api.eu-west-1.amazonaws.com/Prod"',
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
