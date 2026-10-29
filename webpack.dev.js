// webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: __dirname,
      // watch index.html and data/, but not the thousands of files in node_modules
      watch: { ignored: /node_modules|\.git/ },
    },
    open: true, // use "chrome" for PC
  },
});

