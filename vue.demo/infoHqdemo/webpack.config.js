const path = require('path')
const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const glob = require('glob')
const pages = glob.sync('./src/pages/*');
const pageEntry = pages.reduce((prev,curr)=>{
  prev[curr.slice(12)] = curr;
  return prev;
},{})
const pageHtmlWebpackPlugin = pages.map(item=>{
  var pageName=item.slice(12)
  return new HtmlWebpackPlugin({
    filename: pageName+'.html',
    template: 'src/index.html',
    chunks:[pageName,'vendor'],
    title:pageName
  })
})

module.exports = (options = {}) => ({

  entry:Object.assign( {
    vendor: './src/vendor',
  },pageEntry),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : 'js/[name].js?[chunkhash:8]',
    chunkFilename: 'js/parts/[name].js?[chunkhash:8]'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                scss: 'style-loader!css-loader!sass-loader',
                sass: 'style-loader!css-loader!sass-loader?indentedSyntax',
            },
        },
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ["style", "css", "sass"]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 512,
            name: "images/[name].[ext]?[hash:8]"
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),

  ].concat(pageHtmlWebpackPlugin),

  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '127.0.0.1',
    port: 8018,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})