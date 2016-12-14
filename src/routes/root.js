// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import App from '../components/App/';
import Home from './Home/components/Home/';

export default function configureRoutes(reducerRegistry) {
	const root = {
		path: '/',
		component: App,
		getChildRoutes(location, cb) {
			require.ensure([], (require) => {
				cb(null, [
					require('./About').default, // no need to modify store, no reducer
					require('./FAQ').default(reducerRegistry), // add async reducer
					require('./NotFound').default // no need to modify store, no reducer
				]);
			});
		},
		indexRoute: {
			component: Home
		}
	};

	return root;
}
