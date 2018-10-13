const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const OUTPUT_FOLDER = resolve(__dirname, '../dist');

module.exports = {
  entry: {
    main: resolve(__dirname, '../src/index.jsx'),
  },
  output: {
    path: OUTPUT_FOLDER,
    filename: '[name]-[hash].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: resolve(__dirname, '../res/index.pug'),
        filename: 'index.html',
      },
    ),
    new webpack.HotModuleReplacementPlugin,
  ],
  devServer: {
    port: 3000,
    hot: true,
    inline: true,
    watchContentBase: true,
    compress: true,
    historyApiFallback: true,
    contentBase: OUTPUT_FOLDER,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use:  ['raw-loader', 'pug-html-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // polyfill for new browser
              '@babel/preset-react', // react jsx compiler
            ],
          },
        },
      },
    ],
  },
};
