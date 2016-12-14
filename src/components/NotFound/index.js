import React from 'react';

if (process.env.BROWSER) {
	require('./not-found.scss');
}

const NotFound = () =>
  <div>
    <h2>Page Not Found!</h2>
  </div>;

export default NotFound;
