# ankitsardesai.ca - AI Context

> **For Claude Code and AI assistants** - Critical project-specific instructions.

## Build Commands

```bash
npm run watch          # Dev: Webpack HMR + Express + BrowserSync (localhost:3000)
npm run compile        # Production build with linting
npm run production     # Start production server (port 5092)
npm run setup-db       # Initialize SQLite database
```

## Architecture Overview

Full-stack React SSR with Express and SQLite:
- **Server**: Express renders React to HTML, serves `/api/getNextPhoto/:prev`
- **Client**: React 18 hydrates server state, handles photo transitions
- **Styling**: StyleX (atomic CSS-in-JS) extracted at build time

## Key Files

| File | Purpose |
|------|---------|
| `app/app.tsx` | Main component (~630 lines), all styles, photo carousel logic |
| `app/server.tsx` | Express server, SSR, API routes |
| `app/client.tsx` | Client hydration entry point |
| `webpack.config.js` | Production webpack with StyleX unplugin |
| `webpack.dev.config.js` | Dev webpack with HMR |
| `Gulpfile.js` | Build orchestration (lint → typecheck → webpack) |

## StyleX Patterns

This project uses [StyleX](https://stylexjs.com/) for CSS-in-JS. Key patterns:

### Style Definition
```typescript
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    backgroundColor: '#000',
  },
});
```

### Style Application
```tsx
// Spread the props object (includes className and style)
<div {...stylex.props(styles.container)} />

// Conditional styles
<div {...stylex.props(styles.base, isActive && styles.active)} />
```

### Nested Pseudo-classes (StyleX-specific)
```typescript
// For hover/focus states on pseudo-elements, nest the state inside the property:
'::before': {
  opacity: {
    default: 0,        // Base state
    ':hover': 1,       // Hover state
    ':focus-visible': 1,
  },
}
```

### Keyframes (must be outside stylex.create)
```typescript
const fadeIn = stylex.keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const styles = stylex.create({
  animated: {
    animationName: fadeIn,
  },
});
```

## TypeScript Notes

- Uses `transpileOnly: true` in ts-loader (type checking is separate via `checkTypes` gulp task)
- Run `npx tsc --noEmit` to check types without building
- IconProps in `app/types.ts` has optional `className` for StyleX compatibility

## ESLint Warnings

The `sort-keys` warnings for StyleX nested syntax are expected and intentional:
```
warning  Expected object keys to be in ascending order. ':hover' should be before 'default'
```
StyleX requires `default` to come first. These warnings can be ignored.

## Development Workflow

1. Start dev server: `npm run watch`
2. Open `http://localhost:3000` (BrowserSync proxy)
3. Webpack HMR at `localhost:8080`, Express at `localhost:5092`
4. Changes to `.tsx` files trigger automatic rebuild

## Common Issues

### Build Cache Corruption
If you see `SyntaxError: Unexpected token 'i', "import * a"... is not valid JSON`:
```bash
rm -rf .tsbuildinfo node_modules/.cache build/*
npm run watch
```

### Node Version
Requires Node 18+ or 25+. sqlite3 5.1.7 has native binaries for these versions.
