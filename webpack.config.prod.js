var path = require('path');
var webpack = require('webpack');
var devConfig = require('./webpack.config.dev');
var DashboardPlugin = require('webpack-dashboard/plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEnvVars() {
	return {
		'process.env': {
			'NODE_ENV': JSON.stringify('production'),
			'BROWSER': JSON.stringify(true)
		}
	};
}

module.exports = {
	devtool: false,
	entry: {
		main: [
			'./src/client.js'
		],
		vendor: devConfig.entry.vendor
	},
	output: {
		path: __dirname + '/build/static',
		filename: '[name]_[hash].js',
		chunkFilename: '[id].chunk_[hash].js',
		publicPath: '/build/static/'
	},
	module: {
		rules: [
			{
			loader: 'eslint-loader',
			enforce: 'pre',
			test: /\.jsx?$/,
			include: './src/js/**/*'
		}, {
			loader: 'babel-loader',
			test: /\.jsx?$/,
			exclude: /(node_modules)/
		}, {
			loader: ExtractTextPlugin.extract({
				fallback: 'sass-loader',
				use: 'css-loader'
			}),
			test: /\.s?css$/,
			exclude: /(node_modules)/
		}, {
			test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 25000,
				name: 'static/media/[name].[hash:8].[ext]'
			}
		}]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor_[hash].js',  2),
		new AssetsPlugin({filename: 'assets.json'}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				unused: true,
				dead_code: true,
				screw_ie8: true,
			}
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin(getEnvVars()),
		new ExtractTextPlugin({filename: 'style.css'})
	]
};
