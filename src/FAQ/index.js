if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes(reducerRegistry, sagaRegistry) {
	return {
		path: 'faq',
		getComponents(nextState, cb) {
			require.ensure([], require => {
                // First require the main component
				const FAQ = require('./components/FAQ/').default;
                // Then the reducer
				let faqReducer = require('./reducer').default;
				reducerRegistry.register({faqReducer});
				// And finally the Sagas
				let faqSagas = require('./sagas').default;
				sagaRegistry.register({'faqSagas': faqSagas});

                // Configure hot module replacement for core reducers
				if (process.env.NODE_ENV !== 'production') {
					if (module.hot) {
						module.hot.accept('./reducer', () => {
							faqReducer = require('./reducer').default;
							reducerRegistry.register({faqReducer});
						});
					}
				}
				cb(null, FAQ);
			});
		}
	};
}
