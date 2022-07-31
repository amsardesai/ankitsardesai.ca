/**
 * @module sqlite3
 * A set of utilities for interating with the sqlite3 database.
 */

import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new sqlite3.Database(join(__dirname, '../../database.db'));

/**
 * Returns a promised version of db.get()
 */
export function get(
  query: string,
  ...values: Array<string>
): Promise {
  return new Promise((resolve, reject) => {
    db.get(query, ...values, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

/**
 * Returns a promised version of db.all()
 */
export function all(
  query: string,
  ...values: Array<string>
): Promise {
  return new Promise((resolve, reject) => {
    db.all(query, ...values, (err, row) => (err ? reject(err) : resolve(row)));
  });
}
