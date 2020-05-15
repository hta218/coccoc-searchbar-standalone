const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Searchbar Stand-alone',
			filename: 'index.html',
			template: path.resolve(__dirname, 'templates/index.html')
		}),
		new webpack.ProvidePlugin({
			'createElement': [path.resolve(__dirname, './utils/JSX.js'), 'default']
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new WebpackBar()
	],
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							esModule: false
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								// auto: true,
								localIdentName: '[name]---[local]---[hash:base64:5]'
							},
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					}
				}
			},
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
						plugins: [
							["@babel/plugin-transform-react-jsx", { pragma: "createElement", pragmaFrag: "'fragment'" }]
						],
					}
				}
			},
		]
	},
	mode: "development",
	devServer: {
		contentBase: path.join(__dirname, './dist'),
		port: 9000,
		disableHostCheck: true,
		noInfo: true,
		stats: 'minimal'
	}
};
