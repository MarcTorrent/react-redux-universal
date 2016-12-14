if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes(reducerRegistry) {
	return {
		path: 'faq',
		getComponents(location, cb) {
			require.ensure([], require => {
                // First require the main component
				const FAQ = require('./components/FAQ/').default;
                // Then the reducer
				let faqReducer = require('./reducer').default;
				reducerRegistry.register({faqReducer});

                // Configure hot module replacement for core reducers
				if (process.env.NODE_ENV !== 'production') {
					if (module.hot) {
						module.hot.accept('./reducer', () => {
							faqReducer = require('./reducer').default;
							reducerRegistry.register({faqReducer});
						});
                        // TODO: hot reloading for sagas
					}
				}
				cb(null, FAQ);
			});
		}
	};
}
