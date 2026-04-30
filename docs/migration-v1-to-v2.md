# Migration guide: `nestjs-asyncapi` v1.x → v2.x

`nestjs-asyncapi` v2 targets the [AsyncAPI 3.0.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0) spec exclusively. v3 of the spec is not backwards-compatible with v2.x of the spec, so the library follows suit. There is no shim layer — every v1.x application needs a small set of code changes to upgrade.

This guide covers everything you need to change in **your application** to move from `nestjs-asyncapi@1.x` to `nestjs-asyncapi@2.x`.

## TL;DR

```diff
- @AsyncApiPub({ ... })
+ @AsyncApiSend({ ... })

- @AsyncApiSub({ ... })
+ @AsyncApiReceive({ ... })

  new AsyncApiDocumentBuilder()
-   .addServer('feline-ws', { url: 'ws://localhost:3000', protocol: 'socket.io' })
+   .addServer('feline-ws', { host: 'localhost:3000', protocol: 'socket.io' })
```

If you only consume the rendered HTML, those two changes plus `npm install nestjs-asyncapi@^2` are usually enough. If you consume the JSON/YAML output programmatically, also read [Document shape changes](#document-shape-changes) below.

---

## Why v2

AsyncAPI 3.0 reshaped the document model in two structural ways:

1. **Operations are no longer nested in channels.** v2 had `channels[ch].publish` / `channels[ch].subscribe`; v3 has a top-level `operations` map whose entries `$ref` back to the channel.
2. **`publish` / `subscribe` were renamed to `send` / `receive`** — the verbs are now from the application's perspective, not the broker's.

Both shifts ripple into the library's public API. Everything else in this guide is a consequence of those two facts.

---

## 1. Decorator renames

The decorators were renamed to match the spec.

| v1.x | v2.x | Meaning |
|---|---|---|
| `@AsyncApiPub` | `@AsyncApiSend` | This application **sends** a message to the channel |
| `@AsyncApiSub` | `@AsyncApiReceive` | This application **receives** a message from the channel |

The decorator **options are otherwise unchanged** — `channel`, `message`, `operationId`, `description`, `tags`, `bindings`, `traits` all keep the same shape.

```diff
  @Controller()
  class FelinesController {
-   @AsyncApiPub({
+   @AsyncApiSend({
      channel: 'create/feline',
      message: { payload: CreateFelineDto },
    })
    async createFeline() { /* ... */ }

-   @AsyncApiSub({
+   @AsyncApiReceive({
      channel: 'create/feline',
      message: { payload: CreateFelineDto },
    })
    async onFelineCreated() { /* ... */ }
  }
```

If you used `@AsyncApiOperation` directly with a `type` option, the values changed too:

```diff
- @AsyncApiOperation({ type: 'pub', /* ... */ })
+ @AsyncApiOperation({ type: 'send', /* ... */ })

- @AsyncApiOperation({ type: 'sub', /* ... */ })
+ @AsyncApiOperation({ type: 'receive', /* ... */ })
```

### Codemod

If you'd rather not click through every file, a sed/grep pass covers the common cases:

```bash
# macOS
grep -rl --include='*.ts' '@AsyncApiPub\|@AsyncApiSub' . \
  | xargs sed -i '' \
      -e 's/@AsyncApiPub/@AsyncApiSend/g' \
      -e 's/@AsyncApiSub/@AsyncApiReceive/g' \
      -e "s/AsyncApiPub,/AsyncApiSend,/g" \
      -e "s/AsyncApiSub,/AsyncApiReceive,/g"
```

Then review the diff — verify imports from `nestjs-asyncapi` were updated alongside the decorator usages.

---

## 2. Server configuration: `url` → `host`

AsyncAPI v3 split the old `url` field into `host` (+ optional `pathname`, `port`). `AsyncApiDocumentBuilder.addServer()` follows the new shape.

```diff
  new AsyncApiDocumentBuilder()
    .setTitle('Feline')
    .addServer('feline-ws', {
-     url: 'ws://localhost:3000',
+     host: 'localhost:3000',
      protocol: 'socket.io',
    })
    .build();
```

`host` does **not** include the protocol scheme — that goes in `protocol`. If your old `url` had a path, move it to `pathname`:

```diff
  .addServer('feline-ws', {
-   url: 'wss://api.example.com:8443/realtime',
+   host: 'api.example.com:8443',
+   pathname: '/realtime',
    protocol: 'wss',
  })
```

### Server security: now an array of `$ref`s

If you were attaching `security` to a server inline, v3 expects an array of references to schemes declared in `components.securitySchemes` (declared via `addSecurity()`):

```diff
  new AsyncApiDocumentBuilder()
    .addSecurity('user-password', { type: 'userPassword' })
    .addServer('feline-ws', {
      host: 'localhost:3000',
      protocol: 'socket.io',
-     security: [{ 'user-password': [] }],
+     security: [{ $ref: '#/components/securitySchemes/user-password' }],
    })
```

Inline security objects are still allowed by the spec, but `$ref` is the recommended shape.

---

## 3. Document shape changes (only if you consume JSON/YAML)

If your application only renders the AsyncAPI HTML page, you can stop reading. If you fetch `/<doc-path>-json` or `/<doc-path>-yaml` and parse it (e.g. for codegen, schema validation, or external tooling), the document layout changed:

```jsonc
// v1.x — operations nested inside channels
{
  "asyncapi": "2.5.0",
  "channels": {
    "create/feline": {
      "publish":   { "message": { /* ... */ } },
      "subscribe": { "message": { /* ... */ } }
    }
  }
}

// v2.x — operations are top-level, channels hold a named messages map
{
  "asyncapi": "3.0.0",
  "channels": {
    "createFeline": {
      "address":  "create/feline",
      "messages": {
        "CreateFelineDto": { "$ref": "#/components/messages/CreateFelineDto" }
      }
    }
  },
  "operations": {
    "sendCreateFeline": {
      "action":   "send",
      "channel":  { "$ref": "#/channels/createFeline" },
      "messages": [{ "$ref": "#/channels/createFeline/messages/CreateFelineDto" }]
    },
    "receiveCreateFeline": {
      "action":   "receive",
      "channel":  { "$ref": "#/channels/createFeline" },
      "messages": [{ "$ref": "#/channels/createFeline/messages/CreateFelineDto" }]
    }
  },
  "components": {
    "messages": {
      "CreateFelineDto": { "payload": { "$ref": "#/components/schemas/CreateFelineDto" } }
    }
  }
}
```

A few specifics worth flagging:

- **Channel keys are sanitized.** Slashes and other non-identifier characters in your `channel: 'create/feline'` decorator argument are converted to a camelCase JSON-Reference-safe key (`createFeline`). The original string is preserved in `channels[key].address`. Routing addresses on the wire are unchanged — only the *document key* is rewritten.
- **Operation IDs are auto-generated** as `${action}${PascalCase(channelKey)}` (e.g. `sendCreateFeline`). To override, pass `operationId` on the decorator.
- **Messages are deduplicated into `components.messages`** and referenced from both channels and operations.
- **Tags moved.** The document-level `tags` array now lives at `info.tags`. The builder's `addTag()` method signature did not change — the field just emits to a different location.

---

## 4. Toolchain bumps (no app changes required)

These are internal but worth knowing about if you have unusual environments:

| | v1.x | v2.x |
|---|---|---|
| `@asyncapi/generator` | 1.x | 2.x |
| `@asyncapi/html-template` | 0.x | 3.x (React-based) |
| Bundled `isomorphic-dompurify` | (transitive) | pinned to `2.14.0` via `overrides` for ESM compat |

The HTML output looks different (new template) but is served from the same routes (`/<path>`, `/<path>-json`, `/<path>-yaml`).

If you don't need PDF/Markdown rendering, you can still skip the chromium download:

```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i nestjs-asyncapi
```

---

## 5. Upgrade checklist

1. `npm install nestjs-asyncapi@^2`
2. Replace `@AsyncApiPub` → `@AsyncApiSend`, `@AsyncApiSub` → `@AsyncApiReceive` (and update imports)
3. Replace `type: 'pub' | 'sub'` → `type: 'send' | 'receive'` on any direct `@AsyncApiOperation` calls
4. Update every `addServer({...})`: `url` → `host` (split off `pathname` if present)
5. If you set `security` inline on servers, switch to `$ref` form
6. If you parse the rendered JSON/YAML downstream, update consumers for the v3 document shape
7. Run your app and visit the docs page — the rendered UI is the fastest sanity check

---

## Need help?

If something in your migration isn't covered here, open an issue with a minimal reproduction at <https://github.com/flamewow/nestjs-asyncapi/issues> and link this guide.
