
import type { PhotoInfo } from '../utils/types.js';

type Action = {
  type: string,
  name: string,
  location: string,
};

export type State = {
  prev?: PhotoInfo,
  current: PhotoInfo,
  next: PhotoInfo,
};

export default function reducer(
  prevState: State,
  action: Action,
): State {
  switch (action.type) {
    case 'PUSH_NEW_PHOTO': return {
      ...prevState,
      prev: prevState.current,
      current: prevState.next,
      next: {
        name: action.name,
        location: action.location,
      },
    };
    default: return {
      ...prevState,
    };
  }
};
