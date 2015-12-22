
import React from 'react';

export default React.createClass({

  propTypes: {
    children: React.PropTypes.node,
  },

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  },

});

