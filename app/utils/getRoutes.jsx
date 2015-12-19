
// Import external modules
import React from 'react';
import { Route, Redirect } from 'react-router';

// Import components
import App from '../components/App';

export default function getRoutes() {
  return (
    <Route component={App} />
  );
}

