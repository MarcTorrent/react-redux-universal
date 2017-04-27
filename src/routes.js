// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import App from './App/components/App/';
import Home from './Home/components/Home/';
import Signin from './App/components/Auth/signin';
import Signup from './App/components/Auth/signup';

export default function configureRoutes(reducerRegistry, sagaRegistry) {
	const root = {
		path: '/',
		component: App,
		getChildRoutes(location, cb) {
			require.ensure([], (require) => {
				cb(null, [
					{
						path: 'signin',
						component: Signin
					},
					{
						path: 'signup',
						component: Signup
					},
					require('./User').default(reducerRegistry, sagaRegistry), // add async reducer and sagas
					require('./About').default, // no need to modify store, no reducer
					require('./FAQ').default(reducerRegistry, sagaRegistry), // add async reducer
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
