const webpack = require("webpack");

const { CheckerPlugin } = require("awesome-typescript-loader");
const { DefinePlugin } = webpack;
const { UglifyJsPlugin } = webpack.optimize;

const filename = "zxcvbn-typescript";
const libraryName = "zxcvbn";

// Shared webpack settings
const webpack_settings = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts"],
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      }
    ]
  }
};

// Release build
const webpack_release = {
  output: {
    path: `${__dirname}/dist`,
    filename: `${filename}.min.js`,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [
    new CheckerPlugin(),
    new UglifyJsPlugin(),
    new DefinePlugin({
      "ENV.FREQUENCY_LIST": JSON.stringify(require("./frequency_list.json"))
    })
  ]
};

// Develop build
const webpack_develop = {
  output: {
    path: `${__dirname}/dist`,
    filename: `${filename}.js`,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [
    new CheckerPlugin(),
    new DefinePlugin({
      "ENV.FREQUENCY_LIST": JSON.stringify(require("./frequency_list.json"))
    })
  ]
};

// External build
const webpack_external = {
  output: {
    path: `${__dirname}/dist`,
    filename: `${filename}.external.js`,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [
    new CheckerPlugin(),
    // new UglifyJsPlugin(),
    new DefinePlugin({
      "ENV.FREQUENCY_LIST": undefined
    })
  ]
};

Object.assign(webpack_release, webpack_settings);
Object.assign(webpack_develop, webpack_settings);
Object.assign(webpack_external, webpack_settings);

module.exports = {
  webpack_release: webpack_release,
  webpack_develop: webpack_develop,
  webpack_external: webpack_external
};