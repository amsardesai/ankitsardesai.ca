
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

export default (
  prevState: State,
  action: Action,
) => {
  switch (action.type) {
    case 'GET_NEW_PHOTO': return {
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
