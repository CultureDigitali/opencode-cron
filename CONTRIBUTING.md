# Contributing

```bash
bun install
bun test
bun run typecheck
bun run build
```

- One focused change per PR, with a test.
- Never commit `dist/`, `node_modules/`, secrets, or `.bak`/`.log` files.
- Update `CHANGELOG.md` for user-facing changes.

## Release

```bash
npm version patch|minor|major
npm publish
```
