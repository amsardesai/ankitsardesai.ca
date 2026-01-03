# ankitsardesai.ca - AI Context

> **For Claude Code and AI assistants** - Critical project-specific instructions.

## Build Commands

```bash
npm run dev            # Dev server with Vite HMR (localhost:5092)
npm run build          # Production build (client + server)
npm run production     # Start production server (port 5092)
npm run setup-db       # Initialize SQLite database
npm test               # Run tests with Vitest
```

## Architecture Overview

Full-stack React SSR with Express and SQLite:
- **Server**: Express renders React to HTML, serves `/api/getNextPhoto/:prev`
- **Client**: React 18 hydrates server state, handles photo transitions
- **Styling**: StyleX (atomic CSS-in-JS) extracted at build time

## Key Files

| File | Purpose |
|------|---------|
| `app/app.tsx` | Main component, all styles, photo carousel logic |
| `app/server.tsx` | Express server, SSR, API routes |
| `app/client.tsx` | Client hydration entry point |
| `vite.config.ts` | Vite config with StyleX plugin |

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

- Run `npm run type-check` or `npx tsc --noEmit` to check types
- IconProps in `app/types.ts` has optional `className` for StyleX compatibility

## ESLint Warnings

The `sort-keys` warnings for StyleX nested syntax are expected and intentional:
```
warning  Expected object keys to be in ascending order. ':hover' should be before 'default'
```
StyleX requires `default` to come first. These warnings can be ignored.

## Development Workflow

1. Start dev server: `npm run dev`
2. Open http://localhost:5092
3. Vite HMR handles client-side hot reloading
4. Changes to `.tsx` files trigger automatic rebuild

## Common Issues

### Port Already in Use
If tests fail with `EADDRINUSE: address already in use :::5092`, stop the dev server before running tests.

### Node Version
Requires Node 18+ or 25+. sqlite3 5.1.7 has native binaries for these versions.
