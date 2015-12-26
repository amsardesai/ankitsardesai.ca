
// Import external modules
import GoogleAnalytics from 'react-g-analytics';
import React from 'react';

// Import internal modules
import config from '../../config';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  render() {
    return (
      <div>
        <GoogleAnalytics id={config.analytics.google} />
        {this.props.children}
      </div>
    );
  },
});
