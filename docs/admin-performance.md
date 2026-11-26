# Admin performance diagnosis — 26/11/2026

The previous version shared the public storefront's three cart providers, navigation, animations and support popup through the root layout. The admin also called Auth in both middleware and the page/action, checked membership sequentially, and fetched full CRM record details and forms for every list row. Only navigation-dock links exposed a loading signal.

Database execution averages observed through `pg_stat_statements` were 1.11 ms for membership, 2.72 ms for editorial list, 5.24 ms for orders, 5.26 ms for commercial summary, 10.93 ms for editorial overview, and 2.17 ms for support counters. PostgreSQL and Vercel functions are both in São Paulo. These figures measure SQL execution, not end-to-end network or browser latency.

## Changes

- Keep the public site in a route group with its own layout and leave URLs unchanged. Admin has a distinct, persistent navigation provider. The unique initial admin JS chunks (local gzip measurement, including layouts) decreased from 173,382 bytes to 114,765 bytes (~34%).
- Use verified JWT claims to refresh middleware cookies; fresh `getUser(token)` remains mandatory in every admin page and action. Fetch the protected membership in parallel and compare its ID against the verified user. No shared caching of private RSC data or authorization.
- Fetch and render one lead or book form only when opened, rather than mounting every form and history in a list.
- Use consistent immediate navigation and filtering feedback throughout admin; prevent repeated filter/refresh submissions while pending. Major nav can prefetch the normal loading boundary, detail-list links do not eagerly fetch private records.
- Move the technical help lookup to the settings screen, where the actual contact is needed.
- Log only aggregate phase durations (`[admin-perf]`) on the server; never log credentials or personal details. Compare authenticated navigation timings after the user tests the deployed changes.

## Verify

`npm test`, `npm run build`, `node tests/admin-isolation-smoke.mjs`, local HTTP smoke tests, and transactional `supabase/tests/admin-access.sql`. Actual device/network timing still needs a signed-in test from the operator's browser.
