Tracking install. Write this tracking block into site.config.ts as the `tracking` key, exactly as given, and change nothing else (AGENT.md, CI mode, Tracking installs):

```ts
tracking: {
  googleAdsId: 'AW-18497989799',
  conversions: { form: 'AW-18497989799/vJe1CJTfiZUdEKfZw_RE', call: 'AW-18497989799/rioOCJffiZUdEKfZw_RE' },
},
```

Then run the gate: check 22 must pass.