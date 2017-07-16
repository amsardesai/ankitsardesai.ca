
// Import external modules
import GoogleAnalytics from 'react-g-analytics';
import React from 'react';
import { node } from 'prop-types';

// Import internal modules
import config from '../../config';

export default class App extends React.Component {
  static propTypes = {
    children: node,
  };

  render() {
    return (
      <div>
        <GoogleAnalytics id={config.analytics.google} />
        {this.props.children}
      </div>
    );
  }
}
