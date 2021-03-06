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
import mongoose from 'mongoose';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { createMemoryHistory, RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { trigger } from 'redial';
import Helm from 'react-helmet'; // because we are already using helmet

import middleware from './middleware/';
import configureStore from '../store/configureStore';
import ReducerRegistry from '../store/ReducerRegistry';
import SagaRegistry from '../store/SagaRegistry';
import coreReducers from '../App/reducers/';
import mainSaga from '../App/sagas/';
import authSaga from '../App/sagas/auth';

import ApiRoutes from './api/v1';

import { AUTH_COOKIE } from '../constants';
import { USER_AUTHENTICATED } from '../App/actions/types';

// always delete BROWSER env var in order to avoid client behaviors on server side rendering
delete process.env.BROWSER;

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 5000;
const server = global.server = express();

// DB Setup
const dbURI = 'mongodb://localhost/react_redux_universal';
mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
	console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

// Security
server.disable('x-powered-by');
server.set('port', port);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json({type: '*/*'}));
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

// CORS support
server.use(middleware.cors.configure());

// API
server.use('/api/1/', ApiRoutes);

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
	const sagaRegistry = new SagaRegistry(mainSaga);

	const store = configureStore({}, reducerRegistry, sagaRegistry);
	// Now, configure the core sagas that will always be part of the core bundle
	sagaRegistry.register({'authSaga': authSaga});
	// We need to have a root route for HMR to work.
	const configureRoutes = require('../routes').default;
	const routes = configureRoutes(reducerRegistry, sagaRegistry);
	const { dispatch } = store;
	const history = createMemoryHistory(req.path);

	// TODO: Authorize based on token in cookie
	// But it should be done though a JwtStrategy. Pending to be used, already implemented
	const token = req.cookies[AUTH_COOKIE];
	if (token) {
		dispatch({
			type: USER_AUTHENTICATED
		});
	}

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
