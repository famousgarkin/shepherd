const buildConfig = require('./webpack.config.build')

module.exports = Object.assign(buildConfig, {
	mode: 'development',
	devServer: {
		host: '0.0.0.0',
		contentBase: './dist',
		writeToDisk: true,
	},
})
