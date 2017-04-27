import RequireAuth from '../App/components/Auth/requireAuth';
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes(reducerRegistry, sagaRegistry) {
	return {
		path: 'user',
		getComponents(nextState, cb) {
			require.ensure([], require => {
                // First require the main component
				const Dashboard = require('./components/Dashboard/').default;
                // Then the reducer
				let userReducer = require('./reducer').default;
				reducerRegistry.register({ userReducer });
				// And finally the Sagas
				let userSagas = require('./sagas').default;
				sagaRegistry.register({ userSagas });

                // Configure hot module replacement for core reducers
				if (process.env.NODE_ENV !== 'production') {
					if (module.hot) {
						module.hot.accept('./reducer', () => {
							userReducer = require('./reducer').default;
							reducerRegistry.register({ userReducer });
						});
					}
				}
				cb(null, RequireAuth(Dashboard));
			});
		}
	};
}
