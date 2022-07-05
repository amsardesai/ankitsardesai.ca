
import * as React from 'react';

import { useSelector } from 'react-redux';

import style9 from 'style9';

const styles = style9.create({
  container: {
    width: '100%',
  },
});

export default function App() {
  return (
    <div className={style9(styles.container)}>
      I t works! Ayy lmao!!!
    </div>
  );
}



