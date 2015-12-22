
import route from 'koa-route';

import { get } from '../utils/database';

/**
 * GET /api/background - Get a new random background.
 */
export const getBackground = route.get('/api/background', function* getBackground() {
  try {
    const { query } = this.request;
    const prevName = (query && query.prev) || '';
    const curName = (query && query.current) || '';
    const { name, position } = yield get('SELECT name, position FROM backgrounds ' +
                                         'WHERE name != ? AND name != ?' +
                                         'ORDER BY RANDOM() LIMIT 1', prevName, curName);
    this.body = { name, position };
  } catch (err) {
    this.status = 500;
  }
});
