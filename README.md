# Pencilcase

An independent Papers Backpack for the creator's tools, runtime controls and measured
live usage. Open it from Backpacks. LibreOffice supports background startup loading,
warm retention and explicit preloading. Other available editor/preview/search/file
providers are listed with their actual control and observation support.

Policies: PapersData/native/capability-runtimes/policies.json, atomically persisted.
Recordings: PapersData/native/capability-runtimes/recordings/*.jsonl. Recording is
explicit, one sample per second; stop from the same control. Recordings persist across
restarts and are kept outside authored Backpack state and recovery source ZIPs.
Live counters reset with Papers. Runtime profiles/IDs/processes remain machine-local.

Frontend: public/index.html, style.css, app.js, tools.js. The host client is generated
from the existing As you Go/public/app/host/host-bridge.js with esbuild, preserving one
authoritative implementation. No new runtime installation is required.

ChatGPT local coder opens from its tool entry into a separate page in this Backpack. Its view source lives in `coder/`, migrated from the retired Delegate Wave Backpack. The existing companion service remains the owner of sessions and operational data; this page holds no credentials. Delegate Wave remains archived for recovery.

Source checkout: run `npm ci`, `npm test`, `npm run typecheck:coder`, and `npm run build`. Building the generated host bridge requires the As you Go repository beside this checkout. The generated `public/coder/` bundle is produced by the build and is not committed. Runtime state and recordings remain machine-local.
