import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
await build({ entryPoints: [fileURLToPath(new URL('../As you Go/public/app/host/host-bridge.js', import.meta.url))], bundle: true, format: 'esm', outfile: fileURLToPath(new URL('./public/host.js', import.meta.url)) });
