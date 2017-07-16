
import { createAction } from 'redux-actions';

import { get } from '../utils/api';

/**
 * Changes the scrollTop state to update the UI accordingly.
 */
export const changeScrollTop = createAction('CHANGE_SCROLL_TOP', newScrollTop => newScrollTop);

/**
 * Makes a request to the API server to get a new background.
 */
export const getNewPhoto = createAction('GET_NEW_PHOTO', async (prev, current) => {
  const { name, location } = await get('/api/background', {
    prev: prev.name,
    current: current.name,
  });
  return { name, location };
});
