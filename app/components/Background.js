
import * as React from 'react';

import style9 from 'style9';

const styles = style9.create({
});

export default function Background(): React.MixedElement {
  const name = useSelector(state => state.name);
  const location = useSelector(state => state.location);

  return (
    <div className={style9(styles.container)}>
    </div>
  );
}



