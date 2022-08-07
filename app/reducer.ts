export type Photo = { location: string; name: string };

export type Actions =
  | {
      type: 'SHOW_PHOTO';
    }
  | {
      type: 'PUSH_NEXT_PHOTO';
      name: Photo['name'];
      location: Photo['location'];
    };

export type State = {
  previousPhoto: Photo | undefined;
  currentPhoto: Photo | undefined;
  transitioning: boolean;
};

const initialState: State = {
  currentPhoto: undefined,
  previousPhoto: undefined,
  transitioning: true,
};

export default function reducer(
  prevState: State | undefined = initialState,
  action: Actions,
): State {
  switch (action.type) {
    case 'SHOW_PHOTO':
      return {
        ...prevState,
        transitioning: false,
      };
    case 'PUSH_NEXT_PHOTO':
      return {
        ...prevState,
        currentPhoto: {
          location: action.location,
          name: action.name,
        },
        previousPhoto: prevState.currentPhoto,
        transitioning: true,
      };
    default:
      return prevState;
  }
}

export function getInitialState(name: string, location: string): State {
  return {
    currentPhoto: { location, name },
    previousPhoto: undefined,
    transitioning: true,
  };
}
