
import Helmet from 'react-helmet';
import React from 'react';
import { connect } from 'react-redux';
import { shape, string, func } from 'prop-types';

import Background from './Background';
import MainBox from './MainBox';
import { getNewPhoto } from '../actions/background';

@connect(
  state => ({ background: state.background }),
  { getNewPhoto }
)
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
    }),
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
        <Helmet title="Ankit Sardesai" />
        <div className="main__background-container">
          {prev ? (
            <Background {...prev} isPrev key={prev.name} />
          ) : null}
          <Background {...current} key={current.name} />
          <Background {...next} isNext key={next.name} />
          <div className="main__background main__background--white" />
          <MainBox />
        </div>
      </div>
    );
  }
}
