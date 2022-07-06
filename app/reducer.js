
type Action = {
  type: string,
  name: string,
  location: string,
};

export type State = {
  name: string,
  location: string,
};

export default function reducer(
  prevState: State,
  action: Action,
): State {
  switch (action.type) {
    case 'PUSH_NEW_PHOTO': return {
      name: action.name,
      location: action.location,
    };
    default: prevState;
  }
};

export function getInitialState(
  name: string,
  location: string,
) {
  return { name, location };
}
