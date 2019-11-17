const path = require('path')
const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const glob = require('glob')
// const vuxLoader = require('vux-loader')

const pageEntry = glob.sync('./src/pages/*').reduce((prev,curr)=>{
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

const publicPath = ''

module.exports = (options = {}) => (
  {
    entry:Object.assign( {
      vendor: './src/vendor',
    },pageEntry),
    output: {
      path: resolve(__dirname, 'dist'),
      filename: options.dev ? '[name].js' : 'js/[name].js?[chunkhash]',
      chunkFilename: 'js/[id].js?[chunkhash]',
      // publicPath: options.dev ? '/assets/' : publicPath
    },
    module: {
      rules: [
        // {
        //   test: /\.vue$/,
        //   use: ['vue-loader']
        // },
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
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              // limit: 10000,
              limit: 512,
              name: "images/[name].[hash:8].[ext]"
            }
          }]
        },
        {     
          test: /.less$/,     
          loader: 'style-loader!css-loader!less-loader' 
        },
        {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        },
        {
          test:/ali-oss.*?js$/,
          use: [{
              loader:'babel-loader',
              options:{
                  presets:['es2015']
              }
          },],
        },
        {
          test:/co-gather.*?js$/,
          use: [{
              loader:'babel-loader',
              options:{
                  presets:['es2015']
              }
          },],
        },
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
      host: '127.0.0.1',//'web.zealink.net',//
      disableHostCheck: true,
      port: 8020,
      proxy: {
        '/api/': {
          target: 'http://127.0.0.1:8020',
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
    devtool: options.dev ? '#eval-source-map' : ''//#source-map
  }
)
