//创建webpack.config.js
var webpack = require('webpack');
module.exports = {
     entry:'./main.js', //入口文件
     module:{
      rules: [{
        test: /\.vue$/,
        use: 'vue-loader'
      },{
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]  
      },{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },{
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug:true,
        }
      }]
    },
//其他解决方案配置
resolve: {
    extensions: ['', '.js', '.json', '.css', '.scss']//添加在此的后缀所对应的文件可以省略后缀
},
     //插件
     plugins:[
          new webpack.BannerPlugin('This file is created by ly')
     ]
}