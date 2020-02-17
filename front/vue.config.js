const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
	outputDir: "../static",
	configureWebpack: {
		plugins: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: true,
					warnings: false,
					mangle: true
				}
			}),
		]
	},
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:8080/" // api 개발서버
			}
		}
	}
};
