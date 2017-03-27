var path = require('path');
var webpack = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


function getEnvVars() {
	return {
		'process.env': {
			'NODE_ENV': JSON.stringify(process.env.NODE_ENV) || JSON.stringify('local'),
			'BROWSER': JSON.stringify(true)
		}
	};
}

// Based on https://github.com/facebookincubator/create-react-app/blob/master/config/webpack.config.dev.js
module.exports = {
	devtool: 'source-map',
	entry: {
		main: [
			'./src/client.js'
		],
		vendor: [
			'babel-polyfill',
			'react',
			'react-dom',
			'react-router',
			'redux',
			'react-redux',
			'redux-saga',
			'redux-saga/effects',
			'redux-thunk',
			'redux-logger',
			'redial',
			'react-helmet',
			'webpack/hot/only-dev-server',
			'webpack-hot-middleware/client',
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		chunkFilename: '[id].chunk.js',
		publicPath: '/build/static/'
	},
	module: {
		rules: [
			{
			loader: 'eslint-loader',
			//this is to make sure this runs before other loaders
			enforce: 'pre',
			test: /\.jsx?$/,
			include: path.resolve(__dirname, './src/js'),
		}, {
			loader: 'babel-loader',
			test: /\.jsx?$/,
			exclude: /(node_modules)/,
			options: {
        		presets: [
					['es2015', {modules: false}],
					'react',
					'stage-2'
				]
        	},
		}, {
			loader: ExtractTextPlugin.extract({
				use: ['css-loader', 'sass-loader']
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
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.js',
			minChunks: Infinity
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin(getEnvVars()),
		new DashboardPlugin(),
		new ExtractTextPlugin({filename: 'style.css'})
	],
	devServer: {
		host: '0.0.0.0'
	}
};
