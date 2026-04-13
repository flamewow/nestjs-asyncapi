# nestjs-asyncapi

NestJS module that auto-generates [AsyncAPI](https://www.asyncapi.com/) documentation for event-based services (WebSockets, pub/sub, microservices) using decorators — similar to `@nestjs/swagger` but for async/event-driven APIs.

## Development setup

```bash
npm install
npm run start:dev   # sample app at http://0.0.0.0:4001, docs at /async-api
```

> **Note:** The project `.npmrc` sets `registry=https://registry.npmjs.org` to override any npm registry configured globally.
> Puppeteer's chromium download is skipped via `package.json` `"config": { "puppeteer_skip_chromium_download": true }`, which npm exposes as `npm_package_config_puppeteer_skip_chromium_download` — the AsyncAPI generator bundles puppeteer but we don't need chromium for HTML generation.

## Key commands

| Command | Description |
|---|---|
| `npm run build` | Compile `lib/` to `dist/` |
| `npm run start:dev` | Run sample app in watch mode |
| `npm run test:e2e` | Run e2e tests (Express + Fastify) |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier |
| `npm run release` | Cut a release via release-it |

## Project structure

```
lib/            # published library source
  decorators/   # @AsyncApiPub, @AsyncApiSub, @AsyncApiService, etc.
  explorers/    # scan NestJS modules for decorated classes/methods
  services/     # explorer, scanner, transformer, generator, factory
  interface/    # TypeScript interfaces/types
  binding/      # AMQP, Kafka binding interfaces
  asyncapi.module.ts
  asyncapi-document.builder.ts
  index.ts

sample/         # development sample app (nest-cli.json sourceRoot)
test/           # e2e tests only (express + fastify)
  configs/      # jest config
```

## Path aliases

Defined in `tsconfig.json` — use these instead of deep relative paths:

- `#lib` → `lib/`
- `#sample/*` → `sample/*`
- `#test/*` → `test/*`

## Testing

E2e tests only — no unit tests. Tests run serially (`--runInBand`):

```bash
npm run test:e2e
```

Jest config: `test/configs/jest-e2e.config.ts`. Includes a custom `jest-swagger-plugin.js` transformer.

## NestJS version support

- **peerDependencies** support NestJS v9–v12 (`^9.0.0 || ^10.0.0 || ^11.0.0 || ^12.0.0`)
- **devDependencies** pin the latest stable v11 for local development
- v12 is in alpha (`12.0.0-alpha.2` on npm as of April 2026) — peerDeps are ready, but v12 is not yet stable enough for devDeps

The key v12 API change already handled: `metadataScanner.scanFromPrototype` was replaced with `metadataScanner.getAllMethodNames` in `lib/services/asyncapi.explorer.ts`.

## nest-cli.json

- `sourceRoot`: `sample/` (the sample app is the CLI entry point)
- `entryFile`: `sample/main`
- Includes `@nestjs/swagger` TypeScript compiler plugin for comment introspection

## Publishing

```bash
npm run publish:npm    # stable
npm run publish:next   # next tag
npm run publish:beta   # beta tag
```
