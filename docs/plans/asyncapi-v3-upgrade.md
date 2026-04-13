# AsyncAPI v3 Upgrade Plan

## Overview

This is a **major breaking release** (`2.0.0`). The library will drop v2 entirely and target AsyncAPI Specification 3.0.0 exclusively. The decorator API is renamed to match v3 semantics (`send`/`receive`), the document structure changes fundamentally (operations are no longer nested in channels), and the rendering toolchain is upgraded.

The work is split into **6 phases** with a clear "feature parity first" milestone before adding new v3 capabilities.

---

## What changes in the spec (v2 → v3 primer)

The two biggest structural shifts that touch nearly everything:

**1. Operations leave channels**

```
v2:  channels → {channel} → publish | subscribe → message
v3:  channels → {channel} → address, messages (named map)
     operations → {operationId} → action: send|receive, channel $ref, messages $refs
```

**2. Messages are named and referenced**

v3 channels hold a named `messages` map. Operations then reference specific channel messages via `$ref`. This means messages also land in `components.messages` and channels reference them — more indirection but more reuse.

**Server URL split:**

```
v2: url: "mqtt.example.com:1883"
v3: host: "mqtt.example.com", port: "1883", pathname: optional
```

---

## Phase 1 — TypeScript Interfaces (spec foundation)

**Goal:** Define all v3 data shapes before touching any logic.

**Files to change:**

| File | Change |
|---|---|
| `lib/interface/asyncapi-common.interfaces.ts` | Full rewrite |
| `lib/interface/asyncapi-server.interface.ts` | `url` → `host` + `pathname` + `port`; stop extending Swagger's `ServerObject` |
| `lib/interface/asyncapi-operation-options.interface.ts` | `type: 'pub' \| 'sub'` → `type: 'send' \| 'receive'` |
| `lib/interface/asyncapi-operation-options-raw.interface.ts` | Same rename |
| `lib/interface/denormalized-doc.interface.ts` | `operations: { pub, sub }` → `operations: { send, receive }` |

**Key new interfaces in `asyncapi-common.interfaces.ts`:**

```typescript
// Root document gains top-level `operations`
interface AsyncApiDocument {
  asyncapi: '3.0.0';
  channels?: AsyncChannelsObject;
  operations?: AsyncOperationsObject;  // NEW — top-level sibling of channels
  // ...
}

// Channels no longer hold pub/sub — they hold an address and named messages
interface AsyncChannelObject {
  address?: string;   // actual routing address (e.g. 'user/signedup')
  messages?: Record<string, AsyncMessageObject | ReferenceObject>;  // named map
  description?: string;
  parameters?: Record<string, ParameterObject>;
  bindings?: Record<string, KafkaChannelBinding | AmqpChannelBinding>;
}

// Operations are now top-level with an explicit action
interface AsyncOperationObject {
  action: 'send' | 'receive';          // replaces publish/subscribe
  channel: ReferenceObject;            // $ref: '#/channels/{name}'
  messages?: ReferenceObject[];        // $ref: '#/channels/{ch}/messages/{msg}'
  title?: string;
  summary?: string;
  description?: string;
  tags?: AsyncTagObject[];
  bindings?: Record<string, KafkaOperationBinding | AmqpOperationBinding>;
  traits?: (AsyncOperationTraitObject | ReferenceObject)[];
}

type AsyncOperationsObject = Record<string, AsyncOperationObject>;
```

**Decision:** `address` defaults to the channel key for the initial release. A dedicated `address` option on the decorator is a Phase 7 addition.

---

## Phase 2 — Decorator rename

**Goal:** Replace `@AsyncApiPub`/`@AsyncApiSub` with `@AsyncApiSend`/`@AsyncApiReceive`. This is a clean break — no aliases, no shims.

**Files to change:**

| File | Change |
|---|---|
| `lib/decorators/async-api-pub.decorator.ts` | Delete |
| `lib/decorators/async-api-sub.decorator.ts` | Delete |
| `lib/decorators/async-api-send.decorator.ts` | New file |
| `lib/decorators/async-api-receive.decorator.ts` | New file |
| `lib/asyncapi.constants.ts` | `AsyncApiPub`/`AsyncApiSub` keys → `AsyncApiSend`/`AsyncApiReceive` |
| `lib/decorators/index.ts` | Update exports |
| `lib/index.ts` | Update public exports |

**Comment to add at the top of both new decorator files:**

```typescript
/**
 * AsyncAPI v3 renamed "publish/subscribe" to "send/receive" to reflect the
 * perspective of the application rather than the broker. @AsyncApiSend means
 * "this application SENDS a message to this channel". @AsyncApiReceive means
 * "this application RECEIVES a message from this channel". This matches the
 * AsyncAPI 3.0.0 operation actions (`action: "send" | "receive"`).
 *
 * Migration from v1.x: replace @AsyncApiPub → @AsyncApiSend,
 *                                @AsyncApiSub → @AsyncApiReceive
 */
```

**`@AsyncApiOperation` decorator:** Keep it, but update the `type` option to `'send' | 'receive'`.

---

## Phase 3 — Document generation pipeline

**Goal:** Update every service that builds the document structure from collected metadata to output v3 shape. This is the heaviest phase.

### 3a. `lib/explorers/asyncapi-operation.explorer.ts`

Update metadata key lookups: `DECORATORS.AsyncApiPub` → `DECORATORS.AsyncApiSend`, same for Sub → Receive. The output structure it returns will also change shape slightly.

### 3b. `lib/services/operation-object.factory.ts`

Currently returns a single flat `AsyncOperationObject` (v2). In v3 it needs to return a richer object that knows how to produce:

- The message entry for `components.messages`
- The message reference entry for `channels[].messages`
- The operation entry for the top-level `operations` map

The factory's `create()` method signature changes:

```typescript
interface OperationObjectResult {
  componentMessage: { name: string; message: AsyncMessageObject };
  channelMessageRef: { name: string; ref: ReferenceObject };
  operation: AsyncOperationObject;
}
```

The DTO → `$ref` resolution logic (using Swagger's `SchemaObjectFactory`) stays the same.

### 3c. `lib/services/asyncapi.transformer.ts`

Currently produces `{ channels }`. In v3 it must produce `{ channels, operations }`:

```
v2: flatChannels → merge by key → channels[ch].publish / channels[ch].subscribe
v3: flatChannels → merge by key → channels[ch].messages (named map)
                               → operations[operationId] (top-level, with $ref back to channel)
```

Operation key naming convention: `${action}${PascalCase(channelKey)}` — e.g. channel `user/signedup` with action `send` → `sendUserSignedup`.

The merge logic for same-channel multiple operations (e.g. one `send` and one `receive` on the same channel) must accumulate both in `operations` and deduplicate the channel entry.

### 3d. `lib/services/asyncapi.scanner.ts`

Update `scanApplication()` return type and merge logic:

```typescript
// v2 return
{ channels, components: { schemas } }

// v3 return
{ channels, operations, components: { schemas, messages } }
```

The `messages` component entries are collected as the transformer processes each decorated method.

### 3e. `lib/asyncapi-document.builder.ts`

- `asyncapi: '2.5.0'` → `asyncapi: '3.0.0'`
- `buildDocumentBase()` gains `operations: {}` in the skeleton
- `addServer()` / `addServers()`: change parameter from `AsyncServerObject` with `url` to v3 shape with `host` (public API breaking change — document clearly in migration notes)

### 3f. `lib/asyncapi.module.ts`

- `createDocument()`: update the hardcoded `asyncapi: '2.5.0'` override → `asyncapi: '3.0.0'`
- Merge strategy: `document.operations` handled alongside `document.channels`

---

## Phase 4 — Toolchain upgrade

**Goal:** Upgrade `@asyncapi/generator` v1 → v2 and the HTML template to a v3-compatible version.

**Files to change:**

| File | Change |
|---|---|
| `package.json` | Bump `@asyncapi/generator` and `@asyncapi/html-template` |
| `lib/services/asyncapi.generator.ts` | Update to generator v2 API |

> **Note:** Before coding this phase, verify the exact `@asyncapi/generator@2.x` constructor and `generateFromString` API diff vs v1. The generator object instantiation and method signatures changed between major versions. This is the phase most likely to hit runtime surprises (template compatibility, generator API changes) — isolate and test with the sample app before wiring into e2e tests.

---

## Phase 5 — Sample app update

**Goal:** Update `sample/` to use the new decorator names and v3 server config so it compiles and runs.

**Files to change:**

| File | Change |
|---|---|
| `sample/**/*.ts` | `@AsyncApiPub` → `@AsyncApiSend`, `@AsyncApiSub` → `@AsyncApiReceive` |
| Server config in `sample/` | `url:` → `host:` |

This phase doubles as a manual smoke test — run `npm run start:dev` and verify the docs UI loads at `/async-api`.

---

## Phase 6 — Test updates

**Goal:** Update e2e tests and regenerate all reference fixtures.

**Files to change:**

| File | Change |
|---|---|
| `test/express.e2e-spec.ts` | Update decorator imports if referenced |
| `test/fastify.e2e-spec.ts` | Same |
| `test/misc/references/ref.json` | Full regeneration — v3 document structure |
| `test/misc/references/ref.yaml` | Full regeneration |
| `test/misc/references/ref.html` | Full regeneration (new template output) |

**Strategy:** After Phases 3–5 are working, run `npm run start:dev`, hit the JSON/YAML endpoints, and capture the output as the new reference fixtures. Then run the e2e suite to lock it in.

---

## Phase 7+ — Iterative new v3 features

After feature parity is confirmed (all e2e tests pass), add new v3 capabilities one at a time as minor releases:

| Feature | What it adds | Version |
|---|---|---|
| Channel `address` field | Separate decorator option for routing address vs channel key | `2.1.0` |
| `servers` on channels | `channels[].servers` array to scope a channel to specific servers | `2.2.0` |
| Request/Reply | `reply` object on operations; new option on `@AsyncApiSend` | `2.3.0` |
| Operation security | `security` array on individual operations | `2.4.0` |

---

## Breaking changes summary

| Area | v1.x | v2.0 |
|---|---|---|
| Spec version | AsyncAPI 2.5.0 | AsyncAPI 3.0.0 |
| Pub decorator | `@AsyncApiPub` | `@AsyncApiSend` |
| Sub decorator | `@AsyncApiSub` | `@AsyncApiReceive` |
| Operation type | `type: 'pub' \| 'sub'` | `type: 'send' \| 'receive'` |
| Server config | `url: string` | `host: string` (+ optional `pathname`, `port`) |
| Document channels | channels hold operations | channels hold messages; operations are top-level |
| Generator | `@asyncapi/generator@1.x` | `@asyncapi/generator@2.x` |
| Library version | `1.4.0` | `2.0.0` |

---

## Open questions

1. **Generator v2 API** — needs research before Phase 4. Research upfront or defer until we reach that phase?

2. **Channel key sanitization** — currently the channel key is whatever string is passed (e.g. `'user/signedup'`). In v3, slash-paths as keys work but identifiers are recommended. Auto-sanitize the key (e.g. `user/signedup` → `userSignedUp`) and use the original as `address`, or keep slash-path as both key and address for the initial release?

3. **Operation key naming** — proposed convention `${action}${PascalCase(channelKey)}` (e.g. `sendUserSignedUp`). Should this be configurable from day one via `operationIdFactory`, or add that in a follow-up?
