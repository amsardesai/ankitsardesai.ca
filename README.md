# ankitsardesai.ca

Source code for [my website](https://ankitsardesai.ca) - a full-screen travel photo gallery with Ken Burns animations.

## AI Context

> **For Claude Code and other AI assistants** - Key architectural context to understand this codebase quickly.

### Architecture

**Full-stack TypeScript SSR application:**

```
Client Request → Nginx (SSL) → Express Server → SQLite Query
                                    ↓
                              React SSR + Redux State
                                    ↓
                              HTML with PRELOADED_STATE
                                    ↓
                              Client Hydrates → Fetches Next Photo → Ken Burns Animation
```

- **Server-Side Rendering**: Express renders React to HTML, serializes Redux state to `window.PRELOADED_STATE`
- **Client Hydration**: React 18 `hydrateRoot()` picks up server state, no flash of unstyled content
- **Photo Flow**: Random photo from SQLite → preload next image → CSS transition → Ken Burns effect via Web Animation API

### Key Files

| Purpose | File | Notes |
|---------|------|-------|
| Main React component | `app/app.tsx` | ~630 lines, photo carousel, parallax effects |
| Express server + SSR | `app/server.tsx` | Routes: `/` (SSR), `/api/getNextPhoto/:prev` |
| Client entry | `app/client.tsx` | Hydration, analytics init |
| Redux reducer | `app/reducer.ts` | State: `{currentPhoto, previousPhoto, transitioning}` |
| Build orchestration | `Gulpfile.js` | Lint → TypeScript → Webpack → Asset hash |
| Webpack (prod) | `webpack.config.js` | Style9, minification, hashed output |
| Webpack (dev) | `webpack.dev.config.js` | HMR on port 8080 |
| DB schema | `database.sql` | Single table: `photos(name, location)` |
| Docker app | `Dockerfile` | Node 18, SQLite, production build |
| Docker compose | `docker-compose.yml` | App (5092) + Nginx (80/443) |
| Nginx config | `nginx/hier/etc/nginx/nginx.conf` | SSL termination, reverse proxy |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Redux Toolkit, StyleX (CSS-in-JS) |
| Backend | Express 4.18, SQLite3 |
| Build | Gulp 4, Webpack 5, Babel 7, TypeScript 5.x |
| Deploy | Docker, Nginx, EC2, CloudFlare CDN |
| Assets | Photos on S3 via `cdn.ankitsardesai.ca` |

### Important Patterns

1. **SSR State Transfer**: Server creates Redux store → `renderToString()` → injects state as `window.PRELOADED_STATE` → client hydrates with same state

2. **Photo Preloading**: Before transitioning, fetches `/api/getNextPhoto/:prev`, creates hidden `<img>` to cache, then triggers Redux action

3. **Ken Burns Animation**: Uses Web Animation API with random zoom direction and translation values

4. **Asset Cache Busting**: `gulp-rev` hashes bundle filenames → `rev-manifest.json` maps names → server reads manifest in production

5. **StyleX Extraction**: Babel plugin transforms `stylex.create()` calls → extracts atomic CSS at build time → separate `styles.css`

### Commands

```bash
npm run watch          # Dev mode: Webpack HMR + Nodemon + BrowserSync
npm run compile        # Production build with linting
npm run compile-no-lint # Production build (used in Docker)
npm run setup-db       # Initialize SQLite from database.sql
npm run production     # Start production server
npm run lint           # ESLint check
```

### Database Schema

```sql
CREATE TABLE photos (
  name VARCHAR(17) PRIMARY KEY,  -- e.g., '20170512-DSCF2140'
  location VARCHAR(40)           -- e.g., 'Tokyo, Japan'
);
-- ~100+ travel photos seeded in database.sql
```

### Historical Notes

- Migrated from style9 to StyleX for better TypeScript support and Meta ecosystem alignment
- Upgraded to Node 25+ compatibility (sqlite3 5.1.7, TypeScript 5.x)
- Migrated from Koa to Express (`c284bc1`)
- Major TypeScript adoption (`797a353`)

---

## Installing

### Using Docker

To run the production version with Docker:

```bash
docker-compose build
docker-compose up
```

Then go to `https://<your docker IP>/`.

### Manually

To run the development version, install `sqlite3` and Node.js (v18+ or v25+), then:

```bash
npm install
npm run setup-db
npm run watch
```

Then go to `http://localhost:5092/`

## Copyright

&copy; Ankit Sardesai 2025
