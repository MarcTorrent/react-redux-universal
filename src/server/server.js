require('es6-promise').polyfill();
require('isomorphic-fetch');

import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config.dev';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { createMemoryHistory, RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { trigger } from 'redial';
import Helm from 'react-helmet'; // because we are already using helmet

import configureStore from '../store/configureStore';
import ReducerRegistry from '../store/ReducerRegistry';
import coreReducers from '../App/reducers/';

// always delete BROWSER env var in order to avoid client behaviors on server side rendering
delete process.env.BROWSER;

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 5000;
const server = global.server = express();

// Security
server.disable('x-powered-by');
server.set('port', port);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(hpp());

/* eslint-disable quotes */
server.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "'unsafe-inline'"],
		styleSrc: ["'self'", "'unsafe-inline'"],
		imgSrc: ["'self'"],
		connectSrc: ["'self'", 'ws:'],
		fontSrc: ["'self'"],
		objectSrc: ["'none'"],
		mediaSrc: ["'none'"]
	}
}));
server.use(helmet.xssFilter());
server.use(helmet.frameguard('deny'));
server.use(helmet.ieNoOpen());
server.use(helmet.noSniff());
/* eslint-enable quotes */

server.use(cookieParser());
server.use(compression());

// API
server.use('/api/1/faq', require('./api/v1/faq'));

// Stub for assets, in case running in dev mode.
let assets;

// Webpack (for development)
if (isDeveloping) {
	server.use(morgan('dev'));
	const compiler = webpack(config);
	const middleware = webpackMiddleware(compiler, {
		publicPath: config.output.publicPath,
		contentBase: 'src',
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: true,
			modules: false,
		},

	});
	server.use(middleware);

	server.use(webpackHotMiddleware(compiler, {
		log: console.log,
	}));
} else {
	assets = require('../../assets.json');
	server.use(morgan('combined'));
	server.use('/build/static', express.static('./build/static'));
}

// Render Document (include global styles)
const renderFullPage = (html, initialState, assets) => {
	const head = Helm.rewind();
	// Included are some solid resets. Feel free to add normalize etc.
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				${head.title.toString()}
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				${head.meta.toString()}
				${head.link.toString()}
				<link rel="stylesheet" href="build/static/style.css">
			</head>
			<body>
				<div id="root">${html}</div>
				<script>window.INITIAL_STATE = ${JSON.stringify(initialState)};</script>
				<script src="${ isDeveloping ? '/build/static/vendor.js' : assets.vendor.js}"></script>
				<script src="${ isDeveloping ? '/build/static/main.js' : assets.main.js}"></script>
			</body>
		</html>
	`;
};

// SSR Logic
server.get('*', (req, res) => {
	const reducerRegistry = new ReducerRegistry(coreReducers);
	const store = configureStore({}, reducerRegistry);
	// We need to have a root route for HMR to work.
	const configureRoutes = require('../routes').default;
	const routes = configureRoutes(reducerRegistry);
	const { dispatch } = store;
	const history = createMemoryHistory(req.path);
	
	match({ routes, history }, (err, redirectLocation, renderProps) => {
		if (err) {
			console.error(err);
			return res.status(500).send('Internal server error');
		}

		if (!renderProps) {
			return res.status(404).send('Not found');
		}

		const { components } = renderProps;

		// When using redial
		// Define locals to be provided to all lifecycle hooks:
		const locals = {
			path: renderProps.location.pathname,
			query: renderProps.location.query,
			params: renderProps.params,

			// Allow lifecycle hooks to dispatch Redux actions:
			dispatch
		};

		trigger('fetch', components, locals)
		.then(() => {
			const initialState = store.getState();
			const InitialView = (
				<Provider store={store}>
					<RouterContext {...renderProps} />
				</Provider>
			);

			const html = ReactDOM.renderToString(InitialView);
			res.status(200).send(renderFullPage(html, initialState, assets));
		})
		.catch(e => {
			console.log('Error on redial');
			console.log(e);
		});
	});
});

// Listen
server.listen(port, '0.0.0.0', function onStart(err) {
	if (err) {
		console.log('Server Error');
		console.log(err);
	}

	console.info('==> 🌎 Listening on port %s.' +
		'Open up http://localhost:%s/ in your browser.', port, port);
});

module.exports = server;
