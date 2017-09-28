const { resolve }  = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    entry:  [
            './src/main.js',
            './src/style.scss'
        ]
    ,
  output: {
    path: resolve(__dirname, 'www'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot-loader',
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
       loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }
      
    ],
  },
   plugins: [
    new ExtractTextPlugin("./style.css"),
  ]
};