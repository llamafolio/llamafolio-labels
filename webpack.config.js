const path = require("path");

module.exports = {
  entry: "./index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    library: "llamafolio-labels",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "build"),
    globalObject: "this",
  },
};
