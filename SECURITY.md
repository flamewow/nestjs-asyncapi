# Security policy

## Supported versions

Security fixes are released against the latest minor of `nestjs-asyncapi@2.x` only. v1.x is no longer maintained — please [migrate to v2](docs/migration-v1-to-v2.md).

| Version | Supported |
|---------|-----------|
| 2.x     | ✅        |
| 1.x     | ❌        |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security-sensitive bugs.**

Use GitHub's private vulnerability reporting flow:

1. Open <https://github.com/flamewow/nestjs-asyncapi/security/advisories/new>
2. Describe the issue, the affected versions, and a reproduction if you have one.

You should expect an initial response within 7 days. We'll work with you on a fix and a coordinated disclosure timeline before publishing the advisory.

## Scope

In scope:

- Vulnerabilities in published `nestjs-asyncapi` versions
- Vulnerabilities introduced by this library's direct dependencies that this library exposes through its public API

Out of scope:

- Vulnerabilities in transitive dependencies that aren't reachable from this library's public API (please report those upstream)
- Vulnerabilities in the AsyncAPI specification itself (report to <https://github.com/asyncapi/spec>)
- Vulnerabilities in NestJS or `@nestjs/swagger` (report to <https://github.com/nestjs/nest>)
