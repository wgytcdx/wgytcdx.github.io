const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');// 分析工具
const ExtractTextPlugin = require('extract-text-webpack-plugin');// 提取样式


module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new OptimizeCSSAssetsPlugin({}),
    // 添加插件
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'index_dev.html',
      minify: {
        collapseWhitespace: false, // 删除空格、换行
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
          },
          use: [
            {
              loader: 'css-loader',
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: 'src/css',
            },
          },
          'css-loader',
        ],
      },
      // {
      //   test: /\.(png|jpg|jpeg|gif)$/,
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       limit: 2048,
      //       name: '[name].[ext]',
      //       outputPath: 'img/',
      //       publicPath: 'images/',
      //     },
      //   },
      // },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              name: '[name].[ext]',
              outputPath: 'img/',
              publicPath: 'dist/img/',
              esModule: false,
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src'],
          },
        },
      },
    ],
  },
};
