const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')

module.exports = {
	mode: 'production',
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{from: './assets/config.js'},
				{from: './assets/favicon.ico'},
				{from: './assets/shepherd.png'},
				{from: './README.md'},
			],
		}),
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(jpg|svg|eot|ttf|woff|woff2)$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: 'files',
						name: '[name].[ext]',
					},
				},
			},
		],
	},
}
