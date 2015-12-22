
import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';

import backgroundReducer from './background';

export default combineReducers({
  background: backgroundReducer,
  routing: routeReducer,
});
