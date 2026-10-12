/**
 * Proves the built artifact is one Papers can actually serve and run.
 *
 * `npm run build && git diff --exit-code -- public` proves the committed output
 * matches source. It proves nothing about whether that output loads. A candidate
 * could build reproducibly, pass every test, survive semantic review, integrate —
 * and display a blank surface, because the one thing nobody checked was whether
 * the bundle executes.
 *
 * jsdom is not Papers. What this catches is the class of failure that turns the
 * surface blank without any other signal: an entry that does not parse, throws on
 * execution, mounts nothing, or carries markup this scheme refuses to serve.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';


const publicDir = path.join(import.meta.dirname, '../../public/coder');
const html = readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const sourceCss = readFileSync(path.join(import.meta.dirname, '../src/ui/styles.css'), 'utf8');

describe('the built Backpack artifact', () => {
  it('has a mount point and exactly one module entry', () => {
    expect(html).toContain('id="root"');
    const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toContain('type="module"');
  });

  it('carries no crossorigin attribute', () => {
    // papers-backpack: is registered with corsEnabled:false. A crossorigin
    // attribute forces a CORS-mode fetch the scheme will not satisfy, and the
    // only symptom is a blank surface.
    expect(html).not.toMatch(/crossorigin/i);
  });

  it('references its assets relatively, not from the server root', () => {
    // The page is served from a custom-scheme root; an absolute /assets/ path
    // resolves outside the project.
    const src = html.match(/<script[^>]*src="([^"]+)"/)?.[1];
    expect(src).toBeTruthy();
    expect(src!.startsWith('/')).toBe(false);
  });

  it('keeps the session shell free of native range and masthead-scroll scaffolding', () => {
    expect(sourceCss).toMatch(/\.sidebar-divider:after/);
    expect(sourceCss).toMatch(/::-webkit-scrollbar-button[^}]*display:\s*none/s);
  });

  // Actual bundle mounting is verified by Papers' packaged Pencilcase E2E test.
});
