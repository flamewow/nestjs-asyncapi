---
name: Feature request
about: Propose a new feature or enhancement
title: ''
labels: enhancement
assignees: ''
---

**Problem**
What are you trying to do that the library doesn't support today? Link to the relevant part of the [AsyncAPI 3.0 spec](https://www.asyncapi.com/docs/reference/specification/v3.0.0) if the feature maps to one.

**Proposed solution**
What should the API look like? A short code sketch helps:

```typescript
// e.g. proposed decorator usage
@AsyncApiSend({
  channel: 'orders/created',
  // new option you'd like to see
  reply: { /* ... */ },
})
```

**Alternatives considered**
Workarounds you've tried, or other libraries that solve this differently.

**Additional context**
Anything else — links to spec sections, related issues, or examples from other AsyncAPI tooling.
