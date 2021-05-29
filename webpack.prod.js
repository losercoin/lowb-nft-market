const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/lowb-market'),
	publicPath: 'https://www.pkumozzie.cn/lowb-market/',
    clean: true,
  },
});