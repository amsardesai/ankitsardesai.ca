
import route from 'koa-route';

import { get } from '../utils/database';

/**
 * GET /api/background - Get a new random background.
 */
export const getBackground = route.get('/api/background', async (ctx) => {
  try {
    const { query } = ctx.request;
    const prevName = (query && query.prev) || '';
    const curName = (query && query.current) || '';
    const { name, location } = await get('SELECT name, location FROM backgrounds ' +
                                         'WHERE name != ? AND name != ?' +
                                         'ORDER BY RANDOM() LIMIT 1', prevName, curName);
    ctx.body = { name, location };
  } catch (err) {
    ctx.status = 500;
  }
});
