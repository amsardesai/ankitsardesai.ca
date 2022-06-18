
import Helmet from 'react-helmet';
import React from 'react';
import { connect } from 'react-redux';
import { shape, string, func } from 'prop-types';

// Import internal modules
import Background from './Background';
import MainBox from './MainBox';
import getNewPhoto from '../actions/background';

// @connect(
  // state => ({ background: state }),
  // { getNewPhoto },
// )
export default class Main extends React.Component {
  static propTypes = {
    background: shape({
      prev: shape({
        name: string.isRequired,
        location: string.isRequired,
      }),
      current: shape({
        name: string.isRequired,
        location: string.isRequired,
      }).isRequired,
      next: shape({
        name: string.isRequired,
        location: string.isRequired,
      }).isRequired,
    }).isRequired,
    getNewPhoto: func.isRequired,
  };

  componentDidMount() {
    this.backgroundInterval = setInterval(this.handleChangeBackground, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.backgroundInterval);
  }

  handleChangeBackground = () => {
    const { current, next } = this.props.background;
    this.props.getNewPhoto(current, next);
  };

  render() {
    const { background } = this.props;
    const { prev, current, next } = background;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta property="og:title" content="Ankit Sardesai" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://cdn.ankitsardesai.ca/assets/profile.jpg" />
          <meta property="og:url" content="https://ankitsardesai.ca" />
          <meta
            name="description"
            content="Ankit Sardesai is a software engineer currently working at Facebook."
          />
          <title>Ankit Sardesai</title>
        </Helmet>
        <div className="main__background-container">
          <MainBox />
          {prev && <Background {...prev} isPrev key={prev.name} />}
          <Background {...current} key={current.name} />
          <Background {...next} isNext key={next.name} />
          <div className="main__background main__background--white" />
        </div>
      </div>
    );
  }
}
