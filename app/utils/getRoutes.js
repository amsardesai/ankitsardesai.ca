
// Import external modules
import React from 'react';
import { Route } from 'react-router';

// Import components
import App from '../components/App';
import Main from '../components/Main';

export default function getRoutes() {
  return (
    <Route component={App}>
      <Route path="/" component={Main} />
    </Route>
  );
}
