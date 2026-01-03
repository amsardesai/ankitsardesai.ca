import sqlite3 from 'sqlite3';
import request from 'supertest';

import { createApiApp, getNextPhoto, getRandomPhoto } from '../server.js';

// Helper to create an in-memory test database
function createTestDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        reject(err);
        return;
      }

      db.serialize(() => {
        db.run('CREATE TABLE photos (name TEXT PRIMARY KEY, location TEXT)', (err) => {
          if (err) {
            reject(err);
            return;
          }

          db.run("INSERT INTO photos (name, location) VALUES ('photo1', 'Location 1')");
          db.run("INSERT INTO photos (name, location) VALUES ('photo2', 'Location 2')");
          db.run("INSERT INTO photos (name, location) VALUES ('photo3', 'Location 3')", (err) => {
            if (err) reject(err);
            else resolve(db);
          });
        });
      });
    });
  });
}

// Helper to close database
function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

describe('Database query functions', () => {
  let db: sqlite3.Database;

  beforeAll(async () => {
    db = await createTestDatabase();
  });

  afterAll(async () => {
    await closeDatabase(db);
  });

  describe('getRandomPhoto', () => {
    it('returns a photo with name and location', async () => {
      const photo = await getRandomPhoto(db);

      expect(photo).toHaveProperty('name');
      expect(photo).toHaveProperty('location');
      expect(typeof photo.name).toBe('string');
      expect(typeof photo.location).toBe('string');
    });

    it('returns one of the seeded photos', async () => {
      const photo = await getRandomPhoto(db);

      const validNames = ['photo1', 'photo2', 'photo3'];
      expect(validNames).toContain(photo.name);
    });
  });

  describe('getNextPhoto', () => {
    it('returns a photo different from the previous one', async () => {
      const photo = await getNextPhoto(db, 'photo1');

      expect(photo.name).not.toBe('photo1');
      expect(['photo2', 'photo3']).toContain(photo.name);
    });

    it('returns a photo with name and location', async () => {
      const photo = await getNextPhoto(db, 'photo1');

      expect(photo).toHaveProperty('name');
      expect(photo).toHaveProperty('location');
    });

    it('excludes the previous photo from results', async () => {
      // Run multiple times to increase confidence
      for (let i = 0; i < 10; i++) {
        const photo = await getNextPhoto(db, 'photo2');
        expect(photo.name).not.toBe('photo2');
      }
    });
  });
});

describe('API endpoints', () => {
  let db: sqlite3.Database;
  let app: ReturnType<typeof createApiApp>;

  beforeAll(async () => {
    db = await createTestDatabase();
    app = createApiApp(db);
  });

  afterAll(async () => {
    await closeDatabase(db);
  });

  describe('GET /health', () => {
    it('returns 200 status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
    });

    it('returns JSON with status ok', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('returns JSON with timestamp in ISO format', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('timestamp');
      // Verify it's a valid ISO date
      const date = new Date(response.body.timestamp);
      expect(date.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('GET /api/getNextPhoto/:previousPhoto', () => {
    it('returns 200 status', async () => {
      const response = await request(app).get('/api/getNextPhoto/photo1');

      expect(response.status).toBe(200);
    });

    it('returns JSON with name and location', async () => {
      const response = await request(app).get('/api/getNextPhoto/photo1');

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('location');
    });

    it('returns a different photo than the previous one', async () => {
      const response = await request(app).get('/api/getNextPhoto/photo1');

      expect(response.body.name).not.toBe('photo1');
    });

    it('works with different previous photo values', async () => {
      const response1 = await request(app).get('/api/getNextPhoto/photo2');
      expect(response1.body.name).not.toBe('photo2');

      const response2 = await request(app).get('/api/getNextPhoto/photo3');
      expect(response2.body.name).not.toBe('photo3');
    });
  });
});
