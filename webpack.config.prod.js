/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var devConfig = require('./webpack.config.dev');
var DashboardPlugin = require('webpack-dashboard/plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

require('es6-promise').polyfill();

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
		preLoaders: [{
            loader: 'eslint',
            test: /\.jsx?$/,
            include: './src/js/**/*'
        }],

        loaders: [
            {
                loader: 'babel',
                test: /\.jsx?$/,
                exclude: /(node_modules)/
            },

            {
                loader: ExtractTextPlugin.extract('css!sass'),
                test: /\.s?css$/,
                exclude: /(node_modules)/
            },

			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				loader: 'url',
				query: {
					limit: 25000,
					name: 'static/media/[name].[hash:8].[ext]'
				}
			},

            // JSON is not enabled by default in Webpack but both Node and Browserify
            // allow it implicitly so we also enable it.
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
	},

	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor_[hash].js',  2),
		new webpack.optimize.DedupePlugin(),
		new AssetsPlugin({filename: 'assets.json'}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				unused: true,
				dead_code: true,
				warnings: false,
				screw_ie8: true,
			}
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin(getEnvVars()),
		new webpack.ProvidePlugin({
			'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
			'es6-promise': 'es6-promise'
		}),
		new ExtractTextPlugin('style.css')
	]
};
