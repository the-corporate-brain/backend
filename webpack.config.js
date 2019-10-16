const path = require('path');
const slsw = require('serverless-webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');


module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  optimization: {
    usedExports : true
  },
  externals: {
    'aws-sdk': 'aws-sdk'
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  plugins: [
    //ignore the drivers you don't want. This is the complete list of all drivers -- remove the suppressions for drivers you want to use.
    new FilterWarningsPlugin({
      exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg/, /pg-native/, /pg-query-stream/, /redis/, /sqlite3/, /react-native-sqlite-storage/]
    })
  ]
};
