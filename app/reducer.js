
type Action = {
  type: string,
  name: string,
  location: string,
};

type Photo = {
  name: string,
  location: string,
};

export type State = {
  previousPhoto: Photo | null,
  currentPhoto: Photo,
  transitioning: boolean,
};

export default function reducer(
  prevState: State,
  action: Action,
): State {
  switch (action.type) {
    case 'SHOW_PHOTO': return {
      ...prevState,
      transitioning: false,
    };
    case 'PUSH_NEXT_PHOTO': return {
      ...prevState,
      previousPhoto: prevState.currentPhoto,
      currentPhoto: { name: action.name, location: action.location },
      transitioning: true,
    };
    default: return prevState;
  }
};

export function getInitialState(
  name: string,
  location: string,
) {
  return {
    previousPhoto: null,
    currentPhoto: { name, location },
    transitioning: true,
  };
}
