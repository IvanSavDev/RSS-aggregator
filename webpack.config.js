const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let mode = 'development';
let devMode = true;

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  devMode = false;
}

module.exports = {
  mode,
  entry: './src/index.js',
  devtool: devMode ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },

  devServer: {
    hot: false,
    host: 'localhost',
    open: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },

  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },

  module: {
    rules: [
      { 
        test: /\.(html)$/, use: ['html-loader'] 
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ]
  },

  plugins: 
    [
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new ESLintPlugin(),
    ],
}