
import * as React from 'react';

import style9 from 'style9';

const styles = style9.create({
  avatar: {
    width: '4em',
    height: '4em',
    borderRadius: '50%',
  },
  container: {
    position: 'absolute',
    top: '1em',
    left: '1em',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    opacity: 0.9,
  },
  headline: {
    display: 'flex',
    padding: '15px 15px 0',
  },
  heading: {
    margin: 0,
    lineHeight: '56px',
    fontSize: '2.5em',
    fontWeight: '500',
    margin: '0 12px 0 16px',
  }
});

export default function Details(): React.MixedElement {
  return (
    <div className={style9(styles.container)}>
      <div className={style9(styles.headline)}>
        <img
          src="https://cdn.ankitsardesai.ca/assets/profile.jpg"
          className={style9(styles.avatar)}
        />
        <h1 className={style9(styles.heading)}>Ankit Sardesai</h1>
      </div>
      hello
    </div>
  );
}



