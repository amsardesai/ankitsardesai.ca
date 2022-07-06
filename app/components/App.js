
import * as React from 'react';

import { useSelector } from 'react-redux';

import Details from './Details.js';
import Background from './Background.js';

import style9 from 'style9';

const styles = style9.create({
  container: {
    height: '100vh',
    position: 'relative',
    background: '#000',
  },
});

export default function App(): React.MixedElement {

  return (
    <div className={style9(styles.container)}>
      <Background />



      <Details />
    </div>
  );
}



