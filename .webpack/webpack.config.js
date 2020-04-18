const { resolve } = require("path");
const { merge } = require("webpack-merge");

const common = {
  entry: "./src/client",
  output: {
    library: "alterse",
    libraryTarget: "umd",
    path: resolve("dist/client-compiled"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  stats: "errors-warnings",
  devtool: "source-map",
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
};

module.exports = [
  merge(common, {
    mode: "development",
    output: {
      filename: "client.js",
    },
  }),
  merge(common, {
    mode: "production",
    output: {
      filename: "client.min.js",
    },
  }),
];
