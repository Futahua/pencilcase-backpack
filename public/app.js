import { createHostBridge } from './host.js';
import { tools } from './tools.js';

const host = createHostBridge(window);
const call = async (operation, params = {}) => {
  const result = await host.fileCapability(operation, params);
  if (!result?.ok) throw new Error(result?.message || 'The operation could not be completed.');
  return result;
};
const rows = new Map();
const error = document.querySelector('#error'), record = document.querySelector('#record');
let snapshot = null, polling = false, timer = null;
const fail = value => { error.textContent = value instanceof Error ? value.message : String(value); };

for (const tool of tools) {
  const card = document.createElement('article'); card.className = 'tool'; card.dataset.id = tool.id;
  const head = document.createElement('div'); head.className = 'tool-head';
  const title = document.createElement('h2'); title.textContent = tool.name;
  const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = 'Checking'; head.append(title, badge);
  const description = document.createElement('p'); description.textContent = tool.description;
  if (tool.view) {
    const open = document.createElement('a'); open.className = 'open-view'; open.href = tool.view; open.textContent = 'Open view';
    badge.textContent = 'Separate view'; card.append(head, description, open); document.querySelector('#tools').append(card);
    rows.set(tool.id, { card, view: true }); continue;
  }
  const settings = document.createElement('div'); settings.className = 'settings';
  const startup = document.createElement('input'); startup.type = 'checkbox'; startup.setAttribute('aria-label', `${tool.name}: load at startup`);
  const warm = document.createElement('input'); warm.type = 'checkbox'; warm.setAttribute('aria-label', `${tool.name}: always keep warm`);
  for (const [input, text] of [[startup, 'Load at startup'], [warm, 'Always keep warm']]) { const label = document.createElement('label'); label.append(input, text); settings.append(label); }
  const prepare = document.createElement('button'); prepare.textContent = 'Load now'; settings.append(prepare);
  const note = document.createElement('div'); note.className = 'note';
  const usage = document.createElement('div'); usage.className = 'usage'; usage.textContent = 'Waiting for live data…';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.classList.add('sparkline'); svg.setAttribute('viewBox', '0 0 300 38'); svg.setAttribute('aria-label', 'Recent memory usage');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); svg.append(line); svg.setAttribute('hidden', '');
  card.append(head, description, settings, note, usage, svg); document.querySelector('#tools').append(card);
  const row = { card, badge, startup, warm, prepare, note, usage, svg, line, samples: [], busy: false }; rows.set(tool.id, row);
  async function configure() {
    row.busy = true; startup.disabled = warm.disabled = true;
    try { await call('runtime-configure', { id: tool.id, startupLoad: startup.checked, keepWarm: warm.checked }); error.textContent = ''; }
    catch (err) { fail(err); }
    finally { row.busy = false; await refresh(); }
  }
  startup.addEventListener('change', configure); warm.addEventListener('change', configure);
  prepare.addEventListener('click', async () => { prepare.disabled = true; try { await call('runtime-prepare', { id: tool.id }); error.textContent = ''; } catch (err) { fail(err); } finally { await refresh(); } });
}

function render(data) {
  snapshot = data;
  for (const tool of tools) {
    const row = rows.get(tool.id), capability = data.capabilities?.[tool.id];
    if (row.view) continue;
    const available = tool.providers.some(key => data.providers?.[key] === true);
    const runtime = capability?.runtime, engines = runtime?.runtimes ?? [];
    row.badge.textContent = !available ? 'Unavailable' : engines.some(engine => engine.state === 'starting') ? 'Starting' : engines.some(engine => engine.state === 'active') ? 'In use' : engines.length ? 'Warm' : 'Available';
    const controllable = available && capability?.controls?.startupLoad;
    if (!row.busy) { row.startup.checked = capability?.policy?.startupLoad === true; row.warm.checked = capability?.policy?.keepWarm === true; row.startup.disabled = row.warm.disabled = !controllable; }
    row.prepare.disabled = !controllable || engines.length > 0;
    row.note.textContent = controllable ? 'Startup loading runs in the background. Unsaved work is preserved when an engine leaves Papers.' : !available ? 'Not available on this machine.' : 'This provider exposes no separate resident runtime; startup and warm controls do not apply.';
    const counters = capability?.usage;
    const activity = counters ? `${counters.calls} calls · ${counters.activeCalls} running · ${counters.failures} failed${counters.lastDurationMs === null ? '' : ` · Last: ${Math.round(counters.lastDurationMs)} ms`}` : 'No observed calls this session';
    const samples = engines.map(engine => engine.usage).filter(Boolean);
    const memory = samples.reduce((sum, item) => sum + Number(item.workingSetBytes || 0), 0), cpu = samples.reduce((sum, item) => sum + Number(item.cpuPercent || 0), 0);
    row.usage.textContent = `${activity}${runtime ? `\n${runtime.activeDocuments} open · ${runtime.loadingDocuments} loading · ${engines.length} managed engines` : ''}${samples.length ? `\nMemory: ${(memory / 1048576).toFixed(1)} MB · CPU: ${cpu.toFixed(1)}% total` : '\nProcess memory and CPU are not reported for this provider.'}`;
    row.svg.toggleAttribute('hidden', samples.length === 0);
    if (samples.length) { row.samples.push(memory); if (row.samples.length > 60) row.samples.shift(); const max = Math.max(1, ...row.samples); row.line.setAttribute('points', row.samples.map((value, i) => `${i * 300 / 59},${37 - value / max * 34}`).join(' ')); }
  }
  const recording = data.recording;
  record.textContent = recording ? 'Stop recording' : 'Record live usage';
  document.querySelector('#record-status').textContent = recording?.error ? `Recording failed: ${recording.error}` : recording ? `Recording since ${new Date(recording.startedAt).toLocaleTimeString()}` : 'Not recording';
  document.querySelector('#updated').textContent = `Live · ${new Date(data.sampledAt).toLocaleTimeString()}`;
}
async function refresh() { try { render(await call('runtime-snapshot')); } catch (err) { fail(err); } }
async function listRecordings() {
  try {
    const result = await call('runtime-recordings'), container = document.querySelector('#recordings'); container.replaceChildren();
    for (const item of result.recordings) { const row = document.createElement('div'); row.className = 'recording'; const label = document.createElement('span'); label.textContent = `${new Date(item.createdAt).toLocaleString()} · ${(item.bytes / 1024).toFixed(1)} KB`; const reveal = document.createElement('button'); reveal.textContent = 'Show file'; reveal.addEventListener('click', () => { void call('reveal', { path: item.file }).catch(fail); }); row.append(label, reveal); container.append(row); }
    if (!result.recordings.length) container.textContent = 'No recordings yet.';
  } catch (err) { fail(err); }
}
record.addEventListener('click', async () => { record.disabled = true; try { await call(snapshot?.recording ? 'runtime-recording-stop' : 'runtime-recording-start'); await refresh(); await listRecordings(); } catch (err) { fail(err); } finally { record.disabled = false; } });
document.querySelector('#search').addEventListener('input', event => { const query = event.target.value.toLowerCase(); for (const tool of tools) rows.get(tool.id).card.hidden = !`${tool.name} ${tool.description}`.toLowerCase().includes(query); });
async function poll() { if (polling || document.hidden) return; polling = true; try { await refresh(); } finally { polling = false; timer = setTimeout(poll, 1000); } }
document.addEventListener('visibilitychange', () => { if (timer) clearTimeout(timer); if (!document.hidden) void poll(); });
window.addEventListener('pagehide', () => { if (timer) clearTimeout(timer); });
void poll(); void listRecordings();
