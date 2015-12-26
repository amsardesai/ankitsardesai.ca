
import classNames from 'classnames';
import React from 'react';

export default function Background({ name, position, isNext, isPrev }) {
  const classes = classNames('main__background', {
    ['main__background--next']: isNext,
    ['main__background--prev']: isPrev,
  });

  return (
    <div className={classes}
      style={{
        backgroundImage: `url('//cdn.ankitsardesai.ca/backgrounds/${name}.jpg')`,
        backgroundPosition: position,
      }}
    />
  );
}
