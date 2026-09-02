const modelSelect = document.querySelector('#modelSelect');
const renderButton = document.querySelector('#renderButton');
const cancelButton = document.querySelector('#cancelButton');
const downloadButton = document.querySelector('#downloadButton');
const sourceLink = document.querySelector('#sourceLink');
const repoLink = document.querySelector('#repoLink');
const projectTitle = document.querySelector('#projectTitle');
const statusEl = document.querySelector('#status');
const sourceCode = document.querySelector('#sourceCode');
const commitInfo = document.querySelector('#commitInfo');
const meshInfo = document.querySelector('#meshInfo');
const consoleLog = document.querySelector('#consoleLog');
const viewerEl = document.querySelector('#viewer');
const progressPanel = document.querySelector('#renderProgress');
const progressBar = document.querySelector('#progressBar');
const progressStage = document.querySelector('#progressStage');
const progressDetail = document.querySelector('#progressDetail');
const progressElapsed = document.querySelector('#progressElapsed');

let manifest;
let generatedStl;
let activeWorker;
let activeJobId = 0;
let renderStartedAt = 0;
let elapsedTimer;
let renderPhase = '';
let selectionSerial = 0;

let THREE, OrbitControls, STLLoader, scene, camera, renderer, controls, grid, currentMesh;
let viewerReady = false;
let viewerLoading;

function setStatus(text) { statusEl.textContent = text; }
function log(text, isError = false) {
  consoleLog.textContent += `${isError ? 'ERR ' : ''}${text}\n`;
  consoleLog.scrollTop = consoleLog.scrollHeight;
}
function clearLog() { consoleLog.textContent = ''; }
function formatElapsed(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
function setProgress({ phase, progress, detail }) {
  renderPhase = phase || renderPhase;
  progressPanel.hidden = false;
  progressStage.textContent = renderPhase || 'working';
  progressDetail.textContent = detail || '';
  if (progress == null) progressBar.removeAttribute('value');
  else progressBar.value = Math.max(0, Math.min(100, progress));
}
function stopElapsedClock() {
  if (elapsedTimer) clearInterval(elapsedTimer);
  elapsedTimer = undefined;
}
function startElapsedClock() {
  stopElapsedClock();
  renderStartedAt = performance.now();
  const tick = () => {
    const elapsed = performance.now() - renderStartedAt;
    progressElapsed.textContent = formatElapsed(elapsed);
    if (activeWorker && renderPhase === 'render') {
      setStatus(`Rendering in background worker… ${formatElapsed(elapsed)} elapsed. Page remains usable; Cancel is available.`);
    }
  };
  tick();
  elapsedTimer = setInterval(tick, 1000);
}

async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
async function fetchRepoFile(file) {
  const response = await fetch(new URL(`./repo-src/${file.path}`, import.meta.url), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Cannot load ${file.path}: HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();
  if (await sha256Hex(buffer) !== file.sha256) throw new Error(`SHA-256 mismatch for ${file.path}`);
  return new Uint8Array(buffer);
}
async function loadManifest() {
  setStatus('Loading repository manifest…');
  const response = await fetch(new URL('./scad-manifest.json', import.meta.url), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Cannot load manifest: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.files) || !Array.isArray(data.entries) || !data.entries.length) {
    throw new Error('Invalid/empty repository manifest');
  }
  manifest = data;
  const repoUrl = `https://github.com/${manifest.repository}`;
  repoLink.href = repoUrl;
  const repoName = manifest.repository.split('/').pop();
  projectTitle.textContent = repoName;
  document.title = `${repoName} — CAD Browser Validator`;
  for (const link of document.querySelectorAll('[data-repo-file]')) {
    link.href = `${repoUrl}/blob/${manifest.commit}/${link.dataset.repoFile}`;
  }
  log(`Manifest: ${manifest.files.length} SCAD files, ${manifest.entries.length} renderable entries.`);
}
function selectedEntry() { return manifest?.entries.find(e => e.path === modelSelect.value); }
function filesForEntry(entry) {
  const requested = Array.isArray(entry.dependencies) && entry.dependencies.length
    ? entry.dependencies : manifest.files.map(f => f.path);
  const wanted = new Set([entry.path, ...requested]);
  const files = manifest.files.filter(f => wanted.has(f.path));
  if (!files.some(f => f.path === entry.path)) throw new Error(`No source record for ${entry.path}`);
  return files;
}

async function showSelectedSource() {
  const serial = ++selectionSerial;
  const entry = selectedEntry();
  if (!entry) return;
  if (activeWorker) cancelRender('Selection changed; previous background render cancelled.');
  const file = manifest.files.find(f => f.path === entry.path);
  if (!file) throw new Error(`Manifest entry ${entry.path} has no source record`);
  setStatus(`Loading and verifying ${entry.path}…`);
  const bytes = await fetchRepoFile(file);
  if (serial !== selectionSerial) return;
  sourceCode.textContent = new TextDecoder().decode(bytes);
  const repoUrl = `https://github.com/${manifest.repository}`;
  sourceLink.href = `${repoUrl}/blob/${manifest.commit}/src/${entry.path}`;
  commitInfo.textContent = manifest.commit.slice(0, 8);
  generatedStl = undefined;
  downloadButton.disabled = true;
  meshInfo.textContent = 'not rendered';
  progressPanel.hidden = true;
  progressElapsed.textContent = '0:00';
  if (viewerReady) removeCurrentMesh();
  const dependencyCount = filesForEntry(entry).length;
  setStatus(`Selected ${entry.path}. Source verified; ${dependencyCount}/${manifest.files.length} SCAD file(s) required. Press Render in browser.`);
}

async function loadViewerModules() {
  const [threeModule, controlsModule, loaderModule] = await Promise.all([
    import(new URL('./vendor/three/three.module.js', import.meta.url).href),
    import(new URL('./vendor/three/addons/controls/OrbitControls.js', import.meta.url).href),
    import(new URL('./vendor/three/addons/loaders/STLLoader.js', import.meta.url).href)
  ]);
  THREE = threeModule;
  OrbitControls = controlsModule.OrbitControls;
  STLLoader = loaderModule.STLLoader;
}
function resizeViewer() {
  if (!viewerReady) return;
  const width = Math.max(1, viewerEl.clientWidth), height = Math.max(1, viewerEl.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
function animate() {
  if (!viewerReady) return;
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
async function initViewer() {
  if (viewerReady) return;
  if (viewerLoading) return viewerLoading;
  viewerLoading = (async () => {
    await loadViewerModules();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 5000);
    camera.up.set(0, 0, 1);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    viewerEl.replaceChildren(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x253047, 2.0));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(100, -120, 180);
    scene.add(keyLight);
    grid = new THREE.GridHelper(240, 24, 0x59657a, 0x2d3748);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);
    viewerReady = true;
    resizeViewer();
    animate();
  })().catch(error => { viewerLoading = undefined; throw error; });
  return viewerLoading;
}
function removeCurrentMesh() {
  if (!currentMesh || !scene) return;
  scene.remove(currentMesh);
  currentMesh.geometry.dispose();
  currentMesh.material.dispose();
  currentMesh = undefined;
}
function displayStl(bytes) {
  const exactBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const geometry = new STLLoader().parse(exactBuffer);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  const originalSize = new THREE.Vector3(), center = new THREE.Vector3();
  geometry.boundingBox.getSize(originalSize);
  geometry.boundingBox.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);
  removeCurrentMesh();
  const material = new THREE.MeshStandardMaterial({ color: 0xc9d1d9, roughness: 0.72, metalness: 0.05, side: THREE.DoubleSide });
  currentMesh = new THREE.Mesh(geometry, material);
  scene.add(currentMesh);
  const longest = Math.max(originalSize.x, originalSize.y, originalSize.z, 1), distance = longest * 2.2;
  camera.near = Math.max(0.01, longest / 1000);
  camera.far = Math.max(5000, longest * 30);
  camera.position.set(distance * 0.75, -distance * 0.9, distance * 0.65);
  camera.updateProjectionMatrix();
  controls.target.set(0, 0, 0);
  controls.update();
  grid.scale.setScalar(Math.max(0.5, longest / 120));
  grid.position.z = -originalSize.z / 2;
  const triangles = geometry.attributes.position.count / 3;
  meshInfo.textContent = `${originalSize.x.toFixed(1)} × ${originalSize.y.toFixed(1)} × ${originalSize.z.toFixed(1)} mm · ${Math.round(triangles).toLocaleString()} triangles · browser WASM`;
}

function finishWorker() {
  if (activeWorker) activeWorker.terminate();
  activeWorker = undefined;
  stopElapsedClock();
  renderButton.disabled = false;
  cancelButton.disabled = true;
}
function cancelRender(message = 'Background render cancelled.') {
  if (!activeWorker) return;
  const elapsed = performance.now() - renderStartedAt;
  finishWorker();
  setProgress({ phase: 'cancelled', progress: 0, detail: message });
  progressElapsed.textContent = formatElapsed(elapsed);
  setStatus(message);
  log(message);
}
async function renderSelected() {
  const entry = selectedEntry();
  if (!entry) return;
  if (activeWorker) cancelRender('Previous render cancelled before starting a new one.');
  renderButton.disabled = true;
  cancelButton.disabled = false;
  downloadButton.disabled = true;
  clearLog();
  const jobId = ++activeJobId;
  const worker = new Worker(new URL(`./openscad-worker.js?v=${encodeURIComponent(manifest.commit)}`, import.meta.url),
                            { type: 'module', name: 'openscad-renderer' });
  activeWorker = worker;
  startElapsedClock();
  setProgress({ phase: 'starting', progress: 2, detail: 'Starting background OpenSCAD worker…' });

  const finishWithError = error => {
    if (worker !== activeWorker) return;
    const elapsed = performance.now() - renderStartedAt;
    finishWorker();
    setProgress({ phase: 'failed', progress: 0, detail: error?.message || String(error) });
    progressElapsed.textContent = formatElapsed(elapsed);
    log(error?.stack || String(error), true);
    setStatus(`Render failed: ${error?.message || error}`);
  };
  worker.onerror = event => finishWithError(new Error(event.message || 'OpenSCAD worker crashed'));
  worker.onmessage = async event => {
    const message = event.data || {};
    if (message.jobId !== jobId || worker !== activeWorker) return;
    if (message.type === 'stdout') return log(message.text);
    if (message.type === 'stderr') return log(message.text, true);
    if (message.type === 'phase') {
      setProgress({ phase: message.phase, progress: message.progress, detail: message.detail });
      if (message.phase !== 'render') setStatus(message.detail || message.phase);
      return;
    }
    if (message.type === 'error') return finishWithError(new Error(message.message || 'OpenSCAD worker failed'));
    if (message.type === 'done') {
      const elapsed = message.elapsedMs ?? (performance.now() - renderStartedAt);
      generatedStl = new Uint8Array(message.buffer);
      finishWorker();
      downloadButton.disabled = false;
      setProgress({ phase: 'display', progress: 97, detail: 'Preparing interactive 3D view…' });
      progressElapsed.textContent = formatElapsed(elapsed);
      try {
        await initViewer();
        displayStl(generatedStl);
        setProgress({ phase: 'done', progress: 100, detail: `Completed in ${formatElapsed(elapsed)}.` });
        setStatus(`Rendered ${entry.path} from exact deployed source in ${formatElapsed(elapsed)}.`);
      } catch (error) {
        finishWithError(error);
      }
    }
  };

  try {
    const files = filesForEntry(entry);
    log(`Source closure: ${files.length}/${manifest.files.length} repository SCAD files.`);
    worker.postMessage({ type: 'render', jobId, entryPath: entry.path, files, commit: manifest.commit });
  } catch (error) { finishWithError(error); }
}
function downloadStl() {
  if (!generatedStl) return;
  const filename = selectedEntry().path.split('/').pop().replace(/\.scad$/i, '.stl');
  const url = URL.createObjectURL(new Blob([generatedStl], { type: 'model/stl' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function init() {
  await loadManifest();
  for (const entry of manifest.entries) {
    const option = document.createElement('option');
    option.value = entry.path;
    option.textContent = entry.label || entry.path;
    modelSelect.appendChild(option);
  }
  modelSelect.addEventListener('change', () => showSelectedSource().catch(e => { log(e.stack || e, true); setStatus(`Source load failed: ${e.message}`); }));
  renderButton.addEventListener('click', renderSelected);
  cancelButton.addEventListener('click', () => cancelRender());
  downloadButton.addEventListener('click', downloadStl);
  window.addEventListener('resize', resizeViewer);
  window.addEventListener('beforeunload', () => { if (activeWorker) activeWorker.terminate(); });
  await showSelectedSource();
  try { await initViewer(); } catch (error) { log(`3D viewer init failed: ${error.stack || error}`, true); }
}

init().catch(error => { log(error?.stack || String(error), true); setStatus(`Viewer initialization failed: ${error?.message || error}`); });
