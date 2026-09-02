// Heavy OpenSCAD WebAssembly execution lives in this worker, never the UI thread.
let currentJobId = null;
let currentCommit = '';

function send(type, payload = {}, transfer = []) {
  self.postMessage({ type, jobId: currentJobId, ...payload }, transfer);
}
function ensureDirectory(fs, path) {
  const parts = path.split('/').filter(Boolean);
  let current = '';
  for (const part of parts) {
    current += `/${part}`;
    try { fs.mkdir(current); } catch { /* exists */ }
  }
}
async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
async function fetchVerifiedSource(file) {
  const response = await fetch(new URL(`./repo-src/${file.path}`, self.location.href), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Cannot load ${file.path}: HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();
  if (await sha256Hex(buffer) !== file.sha256) throw new Error(`SHA-256 mismatch for ${file.path}`);
  return new Uint8Array(buffer);
}
async function loadOpenSCAD() {
  send('phase', { phase: 'runtime', progress: 8, detail: 'Loading OpenSCAD WebAssembly runtime in background worker…' });
  const moduleUrl = new URL(`./vendor/openscad/openscad.js?v=${encodeURIComponent(currentCommit)}`, self.location.href).href;
  const wasmModule = await import(moduleUrl);
  const OpenSCAD = wasmModule.default || wasmModule.OpenSCAD || wasmModule.createOpenSCAD;
  if (typeof OpenSCAD !== 'function') throw new Error('OpenSCAD WebAssembly factory export not found');
  const created = await OpenSCAD({
    noInitialRun: true,
    print: text => send('stdout', { text: String(text) }),
    printErr: text => send('stderr', { text: String(text) }),
    locateFile: path => path.endsWith('.wasm')
      ? new URL(`./vendor/openscad/${path}?v=${encodeURIComponent(currentCommit)}`, self.location.href).href
      : path
  });
  const instance = typeof created?.getInstance === 'function' ? created.getInstance() : created;
  if (!instance?.FS || typeof instance.callMain !== 'function') throw new Error('OpenSCAD runtime did not initialize correctly');
  ensureDirectory(instance.FS, '/workspace/src');
  try { instance.FS.mkdir('/locale'); } catch { /* exists */ }
  return instance;
}
async function mountSources(instance, files) {
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const bytes = await fetchVerifiedSource(file);
    const target = `/workspace/src/${file.path}`;
    ensureDirectory(instance.FS, target.slice(0, target.lastIndexOf('/')));
    instance.FS.writeFile(target, bytes);
    if (i === 0 || i === files.length - 1 || (i + 1) % 4 === 0) {
      send('phase', { phase: 'sources', progress: 12 + Math.round(((i + 1) / Math.max(files.length, 1)) * 18),
                      detail: `Verified source ${i + 1}/${files.length}: ${file.path}` });
    }
  }
}
async function render(job) {
  const started = performance.now();
  const instance = await loadOpenSCAD();
  send('phase', { phase: 'sources', progress: 12, detail: `Loading ${job.files.length} required SCAD source file(s)…` });
  await mountSources(instance, job.files);
  const input = `/workspace/src/${job.entryPath}`, output = '/output.stl';
  try { instance.FS.unlink(output); } catch { /* none */ }

  const defineArgs = [];
  for (const define of (job.defines || [])) {
    if (typeof define !== 'string' || define.length > 320) throw new Error('Invalid OpenSCAD -D override payload');
    defineArgs.push('-D', define);
  }

  const detail = defineArgs.length
    ? `Rendering ${job.entryPath} with Manifold and ${defineArgs.length / 2} -D override(s)…`
    : `Rendering ${job.entryPath} with Manifold…`;
  send('phase', { phase: 'render', progress: null, detail });

  let exitCode;
  try {
    exitCode = instance.callMain([
      input,
      ...defineArgs,
      '-o', output,
      '--backend=manifold',
      '--export-format=binstl'
    ]);
  } catch (error) {
    if (typeof error === 'number' && typeof instance.formatException === 'function') error = instance.formatException(error);
    throw new Error(`OpenSCAD invocation failed: ${error}`);
  }
  if (typeof exitCode === 'number' && exitCode !== 0) throw new Error(`OpenSCAD returned exit code ${exitCode}`);
  send('phase', { phase: 'output', progress: 94, detail: 'Reading generated STL…' });
  const bytes = instance.FS.readFile(output);
  if (!bytes?.length) throw new Error('OpenSCAD produced an empty STL file');
  const exact = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  send('done', { elapsedMs: performance.now() - started, byteLength: bytes.byteLength, buffer: exact }, [exact]);
}
self.addEventListener('message', event => {
  const message = event.data || {};
  if (message.type !== 'render') return;
  currentJobId = message.jobId;
  currentCommit = message.commit || '';
  render(message).catch(error => send('error', { message: error?.message || String(error), stack: error?.stack || String(error) }));
});
