/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

require('es6-promise').polyfill();

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
		new webpack.HotModuleReplacementPlugin(),
    	new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin(getEnvVars()),
		new webpack.ProvidePlugin({
			'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
			'es6-promise': 'es6-promise'
		}),
		new DashboardPlugin(),
        new ExtractTextPlugin('style.css')
  ],
  devServer: {
    host: '0.0.0.0'
  }
};
