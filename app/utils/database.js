
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(process.env.DB_URL);

/**
 * Returns a promised version of db.get()
 */
export function get(query, ...values) {
  return new Promise((resolve, reject) => {
    db.get(query, ...values, (err, row) => {
      err ? reject(err) : resolve(row);
    });
  });
}

/**
 * Returns a promised version of db.all()
 */
export function all(query, ...values) {
  return new Promise((resolve, reject) => {
    db.all(query, ...values, (err, row) => {
      err ? reject(err) : resolve(row);
    });
  });
}
