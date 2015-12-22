
import Helmet from 'react-helmet';
import React from 'react';
import { connect } from 'react-redux';

import Background from './Background';
import MainBox from './MainBox';
import { getNewPhoto } from '../actions/background';

const Main = React.createClass({

  propTypes: {

    /**
     * Background object
     */
    background: React.PropTypes.shape({

      /**
       * The current background
       */
      prev: React.PropTypes.shape({

        /**
         * Name of the background
         */
        name: React.PropTypes.string.isRequired,

        /**
         * Background position of the background
         */
        position: React.PropTypes.string.isRequired,

      }),

      /**
       * The current background
       */
      current: React.PropTypes.shape({

        /**
         * Name of the background
         */
        name: React.PropTypes.string.isRequired,

        /**
         * Background position of the background
         */
        position: React.PropTypes.string.isRequired,

      }).isRequired,

      /**
       * The next background
       */
      next: React.PropTypes.shape({

        /**
         * Name of the background
         */
        name: React.PropTypes.string.isRequired,

        /**
         * Background position of the background
         */
        position: React.PropTypes.string.isRequired,

      }).isRequired,

      /**
       * The scrollTop of the window
       */
      windowScrollTop: React.PropTypes.number,

    }),
  },

  componentDidMount() {
    this.backgroundInterval = setInterval(() => {
      const { current, next } = this.props.background;
      this.props.getNewPhoto(current, next);
    }, 8000);

    this.windowTracker = () => {
      const scrollTop = window.scrollY;
      console.log(scrollTop);



    };

    window.addEventListener('resize', this.windowTracker);
  },

  componentWillUnmount() {
    clearInterval(this.backgroundInterval);
    window.removeEventListener('resize', this.windowTracker);
  },

  render() {
    const { prev, current, next } = this.props.background;

    return (
      <div>
        <Helmet title="Main" />
        <div className="main__background-container">
          {prev ? (
            <Background {...prev} isPrev={true} key={prev.name} />
          ) : null}
          <Background {...current} key={current.name} />
          <Background {...next} isNext={true} key={next.name} />
          <div className="main__background main__background--white" />
          <MainBox />
        </div>
      </div>
    );
  },
});

export default connect(
  state => ({ background: state.background }),
  { getNewPhoto }
)(Main);
