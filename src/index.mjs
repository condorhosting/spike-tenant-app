/**
 * Condor Hosting — reference tenant app.
 *
 * A minimal user Worker that gets deployed INTO the condor-tenants dispatch
 * namespace. It proves two things at once:
 *   1. The Worker runs inside the namespace and is reachable via the dispatcher.
 *   2. Its per-tenant Neon Postgres is live and reachable, using the
 *      DATABASE_URL binding injected at deploy time.
 *
 * Uses @neondatabase/serverless (HTTP driver) so it works in Workers with no
 * TCP sockets. TENANT_NAME and BRAND_ID are injected as plain-text bindings.
 */
import { neon } from "@neondatabase/serverless";

export default {
  async fetch(request, env) {
    const tenant = env.TENANT_NAME || "unknown";
    const body = {
      hello: `you are hosted on Condor / ${env.BRAND_ID || "toby-rocks"}`,
      tenant,
      brand_id: env.BRAND_ID || "toby-rocks",
      partner_id: env.PARTNER_ID || null,
      db: null,
      error: null,
    };

    try {
      if (!env.DATABASE_URL) throw new Error("DATABASE_URL binding is missing");
      const sql = neon(env.DATABASE_URL);
      const rows = await sql`SELECT now() AS now, current_database() AS db, version() AS version`;
      body.db = {
        now: rows[0].now,
        database: rows[0].db,
        engine: String(rows[0].version).split(" on ")[0],
      };
    } catch (err) {
      body.error = String((err && err.message) || err);
    }

    return new Response(JSON.stringify(body, null, 2), {
      status: body.error ? 500 : 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  },
};
