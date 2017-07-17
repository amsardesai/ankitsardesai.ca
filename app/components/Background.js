
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';
import React from 'react';

export default ({ name, location, isNext, isPrev }) => {
  return (
    <div
      className={classNames('main__background', {
        ['main__background--next']: isNext,
        ['main__background--prev']: isPrev,
      })}
      aria-hidden={isNext || isPrev ? 'true' : 'false'}
    >
      <div
        className="main__background-image"
        style={{
          backgroundImage: `url('//cdn.ankitsardesai.ca/backgrounds/${name}.jpg')`,
        }}
        role="img"
        aria-label={`Photo taken in ${location}`}
      />
      <div className="main__background-info-container">
        <div className="main__background-author-mark">
          <FontAwesome
            name="camera-retro"
            className="main__background-author-mark-icon"
          />
          photos by me
        </div>
        <div className="main__background-location" aria-hidden="true">
          <FontAwesome
            name="map-marker"
            className="main__background-location-icon"
          />
          {location}
        </div>
      </div>
    </div>
  );
};
