
import request from 'superagent';

import config from '../../config';

export function get(endpoint, params) {
  const baseUrl = __SERVER__ ? `http://localhost:${config.ports.koa}` : '';
  return new Promise((resolve, reject) => {
    request.get(`${baseUrl}${endpoint}`)
      .query(params)
      .end((err, res) => {
        if (err) reject(err)
        else resolve(JSON.parse(res.text));
      });
  });
}
