import type { Dispatch, ReactElement, ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import type { Actions, State } from './reducer.js';
import reducer from './reducer.js';

// Separate contexts for state and dispatch (performance optimization)
const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<Dispatch<Actions> | null>(null);

type Props = {
  children: ReactNode;
  initialState: State;
};

export function AppContextProvider({
  children,
  initialState,
}: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Custom hooks with null checks
export function useAppState(): State {
  const state = useContext(StateContext);
  if (state === null) {
    throw new Error('useAppState must be used within AppContextProvider');
  }
  return state;
}

export function useAppDispatch(): Dispatch<Actions> {
  const dispatch = useContext(DispatchContext);
  if (dispatch === null) {
    throw new Error('useAppDispatch must be used within AppContextProvider');
  }
  return dispatch;
}
