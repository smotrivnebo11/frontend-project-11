/* eslint-disable */
import path from 'path';
import url from 'url';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

export default {
  mode: mode,
  entry: {
    main: './src/js/index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'asset/[hash][ext][query]',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map', // нужно для отладки кода в devtools
  devServer: {
    host: 'localhost',
    static: path.resolve(__dirname, 'dist'),
    port: 5001,
    hot: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          (mode === "development") ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // options  
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
    ]
  },

};