const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/static" : "/",
	outputDir: "../static",
	configureWebpack: process.env.NODE_ENV === "production" ? {
		plugins: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: true,
					warnings: false,
					mangle: true
				}
			}),
			new WebpackObfuscator ({
				rotateStringArray: true
			}, [])
		]
	} : {},
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:8080/" // api 개발서버
			}
		}
	}
};
