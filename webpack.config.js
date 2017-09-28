
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');
    }

    return sources;
}

module.exports = {
    entry: {
        helloWorld: getEntrySources([
            './src/main.js',
            './src/scss/style.scss'
        ])
    },
  output: {
    publicPath: 'http://localhost:8080/',
    filename: 'www/bundle.js',
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
       loaders: [
         'style-loader',
         'css-loader'
       ]
      },
      {
        test: /\.scss$/,
       loaders: [
         'style-loader',
         'css-loader',
         'sass-loader'
       ]
      }
     /* {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
       loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }*/
      
    ],
  },
   plugins: [
    new ExtractTextPlugin("./style.css"),
  ]
};