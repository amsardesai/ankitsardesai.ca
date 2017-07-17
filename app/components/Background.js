
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import React from 'react';

export default function Background({ name, location, isNext, isPrev }) {
  return (
    <div
      className={classNames('main__background', {
        ['main__background--next']: isNext,
        ['main__background--prev']: isPrev,
      })}
    >
      <div
        className="main__background-image"
        style={{
          backgroundImage: `url('//cdn.ankitsardesai.ca/backgrounds/${name}.jpg')`,
        }}
      />
      <div className="main__background-info-container">
        <div className="main__background-location">
          <FontAwesome name="map-marker" className="main__background-location-icon" />
          {location}
        </div>
        <div className="main__background-author-mark">
          <FontAwesome name="camera-retro" className="main__background-author-mark-icon" />
          pictures by me
        </div>
      </div>
    </div>
  );
}
