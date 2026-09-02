#!/usr/bin/env node
import puppeteer from 'puppeteer-core';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8000/';
const executablePath = process.env.CHROME_PATH;
if (!executablePath) throw new Error('CHROME_PATH is required');

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(120_000);
  page.on('console', message => console.log(`[browser:${message.type()}] ${message.text()}`));
  page.on('pageerror', error => console.error(`[browser:pageerror] ${error.stack || error}`));

  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 120_000 });
  await page.waitForSelector('#modelSelect option');

  const options = await page.$$eval('#modelSelect option', nodes => nodes.map(node => node.value));
  if (!options.length) throw new Error('browser manifest exposed no renderable entries');

  const smokeEntry = options.find(path => path.startsWith('parts/')) || options[0];
  await page.select('#modelSelect', smokeEntry);
  await page.waitForFunction(path => document.querySelector('#sourceLink')?.href.includes(path), {}, `src/${smokeEntry}`);

  await page.click('#renderButton');
  await page.waitForFunction(() => {
    const mesh = document.querySelector('#meshInfo')?.textContent || '';
    const status = document.querySelector('#status')?.textContent || '';
    return mesh.includes('browser WASM') || /render failed|viewer error/i.test(status);
  });

  let status = await page.$eval('#status', el => el.textContent || '');
  let mesh = await page.$eval('#meshInfo', el => el.textContent || '');
  if (!mesh.includes('browser WASM')) {
    const diagnostics = await page.$eval('#consoleLog', el => el.textContent || '');
    throw new Error(`Default browser render failed. Status: ${status}\n${diagnostics}`);
  }
  console.log(`Browser WASM render PASS: ${smokeEntry}: ${mesh}`);

  // When the template demonstration is still present, also prove that a mobile
  // review-only -D override is actually passed through the Web Worker to OpenSCAD.
  const demo = 'assemblies/example_mechanism.scad';
  if (options.includes(demo)) {
    await page.select('#modelSelect', demo);
    await page.waitForFunction(path => document.querySelector('#sourceLink')?.href.includes(path), {}, `src/${demo}`);
    await page.$eval('#definesInput', input => {
      input.value = 'DEMO_ANGLE=45';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.click('#renderButton');
    await page.waitForFunction(() => {
      const statusText = document.querySelector('#status')?.textContent || '';
      return statusText.includes('with 1 -D override(s)') || /render failed|viewer error/i.test(statusText);
    });
    status = await page.$eval('#status', el => el.textContent || '');
    mesh = await page.$eval('#meshInfo', el => el.textContent || '');
    if (!status.includes('with 1 -D override(s)') || !mesh.includes('browser WASM')) {
      const diagnostics = await page.$eval('#consoleLog', el => el.textContent || '');
      throw new Error(`Browser -D override render failed. Status: ${status}\n${diagnostics}`);
    }
    console.log(`Browser -D override PASS: ${status}`);
  }
} finally {
  await browser.close();
}
