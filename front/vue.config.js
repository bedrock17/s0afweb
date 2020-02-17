const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
	outputDir: "../static",
	configureWebpack: { 
		optimization: {
			minimizer: [new UglifyJsPlugin()],
		},
	},
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/" // api 개발서버
      }
    }
  }
};
