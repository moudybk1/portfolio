import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page is force-dynamic, so no incremental cache (R2/KV) is needed.
export default defineCloudflareConfig();
