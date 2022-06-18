// @flow

import { get } from 'superagent';

import type { Dispatch, ThunkedAction } from 'redux-thunk';
import type { PhotoInfo } from '../utils/types.js';

export default (
  prev: PhotoInfo,
  current: PhotoInfo,
): ThunkedAction => (dispatch: Dispatch) => {
  get('/api/background')
    .query({
      prev: prev.name,
      current: current.name,
    })
    .end((err, res) => {
      if (!err) {
        const { name, location } = JSON.parse(res.text);
        if (name) {
          dispatch({
            type: 'GET_NEW_PHOTO',
            name,
            location,
          });
        }
      }
    });
};
