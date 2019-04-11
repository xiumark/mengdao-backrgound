const path = require('path');
const webpack = require('webpack');
const globalConfig = require('./src/config.js');

// const G = window?window.g:null;    //配置的静态数据
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 将babel-loader的配置独立出来, 因为webpack的限制: http://stackoverflow.com/questions/33117136/how-to-add-a-query-to-a-webpack-loader-with-multiple-loaders
const babelLoaderConfig = {
  presets: ['latest', 'stage-0', 'react'],  // 开启ES6、部分ES7、react特性, preset相当于预置的插件集合
  plugins: [['import', { libraryName: 'antd', style: true }]],  // antd模块化加载, https://github.com/ant-design/babel-plugin-import
  cacheDirectory: true,
};

// 向less loader传的值, 用于覆盖less源文件中的变量
// 有个小问题就是这个变量只会初始化一次, 不会随globalConfig的变化而变化
// 所以在webpack-dev-server中调试时, 热加载有点问题, 不能实时更新
const lessLoaderVars = {
  sidebarCollapsible: globalConfig.sidebar.collapsible,
};

module.exports = {
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    inline: true,
    host: '0.0.0.0', //保证通过IP可以访问
    port: 8000,
    proxy: {
      '/root': {
        changeOrigin: true,
        // target: 'http://116.62.233.28:5011/',            // 线上服
        target: 'http://10.223.5.199:3011/',             // 吴凡服
        // target: 'http://47.110.255.12:5857/',               // 阿里云测试后台   
        // target: 'http://login.sgyzc.hantangxintong.com/',   // 爱微游后台服务端
        // target: 'http://47.52.248.48:2702/',             // 怪猫繁体服
      }
    }
  },

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'babel-polyfill',  // 可以使用完整的ES6特性, 大概增加100KB
    './src/index.js',  // 编译的入口
  ],

  output: {  // 输出的目录和文件名
    path: path.resolve(__dirname ,'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  resolve: {
    modulesDirectories: ['node_modules', './src'],  // import时到哪些地方去寻找模块
    extensions: ['', '.js', '.jsx'],  // require的时候可以直接使用require('file')，不用require('file.js')
    alias: {
      antdcss: 'antd/dist/antd.min.css',  // import时的别名
    },
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel-loader?' + JSON.stringify(babelLoaderConfig)],  // react-hot-loader可以不用刷新页面, 如果用普通的dev-server的话会自动刷新页面
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loader: 'style!css',
      }, {
        test: /\.less$/,
        loader: 'style!css!' + `less?{"sourceMap":true,"modifyVars":${JSON.stringify(lessLoaderVars)}}`,  // 用!去链式调用loader
      }, {
        test: /\.(png|jpg|svg)$/,
        loader: 'url?limit=25000',  // 图片小于一定值的话转成base64
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin('This file is created by mx'),   // 生成文件时加上注释
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'production' ? 'false' : 'true')),  // magic globals, 用于打印一些调试的日志, webpack -p时会删除
    }),
    // 生成html文件
    new HtmlWebpackPlugin({
      template: 'index.tmpl.html',
      title: globalConfig.name,
      devMode: true,
      favaicon: path.resolve(__dirname, 'src/favicon.ico')
    }),
  ],
};
