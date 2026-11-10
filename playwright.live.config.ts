import { defineConfig } from '@playwright/test';

function localOrigin(value: string) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
      url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) {
    throw new Error('Live tests require a loopback origin without credentials or a path.');
  }
  return url;
}
const enabled = process.env.FIXXIR_LIVE_TESTS === '1';
if (enabled && process.env.FIXXIR_LIVE_ALLOW_WRITES !== 'feature-db') {
  throw new Error('Verify the isolated feature database and email sink, then set FIXXIR_LIVE_ALLOW_WRITES=feature-db.');
}
const api = localOrigin(process.env.FIXXIR_LIVE_API_URL || 'http://127.0.0.1:8181');
const web = localOrigin(process.env.FIXXIR_LIVE_WEB_URL || 'http://127.0.0.1:3193');
const port = Number(web.port);
if (!Number.isInteger(port) || port < 1024 || port > 65535 || web.protocol !== 'http:' || web.hostname !== '127.0.0.1') {
  throw new Error('The live web server needs http://127.0.0.1 with a non-privileged port.');
}

export default defineConfig({
  testDir: './tests/live', workers: 1, timeout: 120000, expect: { timeout: 15000 },
  use: { baseURL: web.origin, trace: 'off', screenshot: 'only-on-failure' },
  webServer: enabled ? {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `${web.origin}/repair/request`, env: { NEXT_PUBLIC_FIXXIR_API_URL: api.origin },
    reuseExistingServer: false, timeout: 60000,
  } : undefined,
});
