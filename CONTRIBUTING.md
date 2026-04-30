# Contributing to nestjs-asyncapi

Thanks for your interest in contributing! This document covers everything you need to know to get a change merged.

## Table of contents

- [Asking questions](#asking-questions)
- [Reporting bugs](#reporting-bugs)
- [Proposing features](#proposing-features)
- [Local development](#local-development)
- [Branch naming](#branch-naming)
- [Commit messages](#commit-messages)
- [Submitting a pull request](#submitting-a-pull-request)
- [Releasing](#releasing) (maintainers)

## Asking questions

Open a [GitHub issue](https://github.com/flamewow/nestjs-asyncapi/issues/new/choose) — the bug-report template doubles as the question template. Please include the same environment info (library version, NestJS version, Node version, HTTP adapter).

Before opening one, search existing issues — the answer may already be there.

## Reporting bugs

Use the **Bug report** template. A minimal reproduction (a small repo, Gist, or self-contained snippet) is required: without one we can't confirm or fix the issue.

## Proposing features

Use the **Feature request** template. For anything non-trivial, please open the issue **before** sending a PR so we can agree on the API shape — this avoids wasted work.

If the feature maps to part of the [AsyncAPI 3.0 specification](https://www.asyncapi.com/docs/reference/specification/v3.0.0), link the relevant section.

## Local development

Requirements:

- Node.js (see `.nvmrc` for the version used in CI)
- npm (bundled with Node)

Setup:

```bash
git clone https://github.com/flamewow/nestjs-asyncapi.git
cd nestjs-asyncapi
npm install
```

Common commands:

| Command | Purpose |
|---|---|
| `npm run build` | Compile `lib/` to `dist/` |
| `npm run start:dev` | Run the sample app at <http://0.0.0.0:4001>, docs at `/async-api` |
| `npm run test:e2e` | Run e2e tests (Express + Fastify) — the only test suite |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier |

The `sample/` directory is a real NestJS app that exercises decorators against both Express and Fastify adapters, including microservices and WebSocket gateways. It's the fastest way to manually verify a change end-to-end.

> Puppeteer's chromium download is skipped via `package.json` `"config".puppeteer_skip_chromium_download`; you don't need chromium installed to develop here.

## Branch naming

Branch names are validated by a Husky pre-commit hook (`validate-branch-name`). The pattern:

```
^(main|dev)$ | ^(feat|fix|release|test|refactor|docs|perf|style|chore)/.+$
```

Examples: `feat/operation-reply`, `fix/channel-key-sanitization`, `docs/migration-guide`.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). The release tooling (`release-it`) generates the changelog from these, so the prefix matters:

```
<type>(<optional scope>): <subject>

[optional body]

[optional footer]
```

Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `style`, `build`, `ci`, `revert`.

Breaking changes go in the footer:

```
feat()!: rename @AsyncApiPub to @AsyncApiSend

BREAKING CHANGE: see docs/migration-v1-to-v2.md
```

## Submitting a pull request

1. Fork the repo and branch off `main`.
2. Make your change. **Add or update e2e tests** — the suite is in `test/` and covers Express + Fastify. There are no unit tests; behavior is verified through the rendered document.
3. Run the full local check:
   ```bash
   npm run lint && npm run test:e2e
   ```
4. Open the PR using the template. Reference the issue it closes.
5. CI will run build + e2e tests. Address any failures before requesting review.

For breaking changes, also update `docs/migration-v1-to-v2.md` (or open a successor migration guide).

## Releasing

> For maintainers only.

```bash
npm run release          # interactive release-it flow
npm run publish:npm      # publish stable to npm
npm run publish:next     # publish under the `next` tag
npm run publish:beta     # publish under the `beta` tag
```

`release-it` will tag the commit, push, and create a GitHub release. The `prepublish:npm` hook runs `npm run build` so the published tarball always reflects the source.
