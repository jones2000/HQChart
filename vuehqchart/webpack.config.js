const path = require('path')
const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const glob = require('glob')

const pageEntry=glob.sync('./src/pages/*').reduce((prev,curr)=>{
  prev[curr.slice(12)] = curr;
  return prev;
},{})
const pageHtmlWebpackPlugin=glob.sync('./src/pages/*').map(item=>{
  var pageName=item.slice(12)
  return new HtmlWebpackPlugin({
    filename: pageName+'.html',
    template: 'src/index.html',
    chunks:[pageName,'vendor'],
    title:pageName
  })
})

// console.log(JSON.stringify(pageEntry))
// console.log(JSON.stringify(pageHtmlWebpackPlugin))

const publicPath = ''

module.exports = (options = {}) => ({

  entry:Object.assign( {
    vendor: './src/vendor',
  },pageEntry),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    // publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader",
      },
      {
        test: /\.styl/,
        use: ['style-loader','css-loader','stylus-loader']
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
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
  ].concat(pageHtmlWebpackPlugin),

  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
