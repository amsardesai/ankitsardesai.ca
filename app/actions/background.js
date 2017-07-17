// @flow

import { get } from 'superagent';
import config from '../../config';

import type { Dispatch, ThunkedAction } from 'redux-thunk';
import type { PhotoInfo } from '../utils/types';

export const getNewPhoto = (
  prev: PhotoInfo,
  current: PhotoInfo,
): ThunkedAction => {
  return (dispatch: Dispatch) => {
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
};
