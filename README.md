# spike-tenant-app

Condor Hosting **Phase 0** reference tenant app.

A minimal Cloudflare Worker that returns JSON: a hello, its tenant name, and a
live `SELECT now()` from its own per-tenant Neon Postgres, using the
`DATABASE_URL` binding injected by the Condor deployer via the
[`@neondatabase/serverless`](https://github.com/neondatabase/serverless) HTTP
driver (works in Workers, no TCP).

This is the app the Phase 0 spike pushes → builds → deploys into the
`condor-tenants` Workers-for-Platforms dispatch namespace.

Deployed by `condorhosting/platform` → `services/deployer`.

<!-- phase0 webhook trigger 2026-07-23T15:17:00Z -->
