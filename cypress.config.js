const http = require('node:http');
const path = require('node:path');
const { execSync, spawn } = require('node:child_process');
const { defineConfig } = require('cypress');

const FRONTEND_URL = 'http://127.0.0.1:5173';
const API_URL = 'http://localhost:3000/docs/swagger.yaml';
const FRONTEND_CWD = path.join(__dirname, 'frontend');
const API_CWD = __dirname;
let frontendProcess;
let apiProcess;

function isUrlReady(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });

    request.on('error', () => resolve(false));
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForUrl(url, serviceName) {
  const startedAt = Date.now();
  const timeout = 30000;

  while (Date.now() - startedAt < timeout) {
    if (await isUrlReady(url)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`${serviceName} nao respondeu em ${url} dentro de ${timeout / 1000}s.`);
}

function stopProcess(processRef) {
  if (!processRef || processRef.killed) {
    return;
  }

  if (process.platform === 'win32') {
    execSync(`taskkill /pid ${processRef.pid} /T /F`, { stdio: 'ignore' });
    return;
  }

  processRef.kill('SIGTERM');
}

function startNpmScript(args, cwd) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  return spawn(npmCommand, args, {
    cwd,
    shell: process.platform === 'win32',
    stdio: 'ignore',
    windowsHide: true
  });
}

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: FRONTEND_URL,
    specPattern: 'frontend/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'frontend/cypress/support/e2e.ts',
    fixturesFolder: 'frontend/cypress/fixtures',
    downloadsFolder: 'frontend/cypress/downloads',
    screenshotsFolder: 'frontend/cypress/screenshots',
    videosFolder: 'frontend/cypress/videos',
    viewportWidth: 1280,
    viewportHeight: 720,
    async setupNodeEvents(on, config) {
      if (!(await isUrlReady(API_URL))) {
        apiProcess = startNpmScript(['start'], API_CWD);
        await waitForUrl(API_URL, 'API');
      }

      if (!(await isUrlReady(FRONTEND_URL))) {
        frontendProcess = startNpmScript(['run', 'dev', '--', '--port', '5173'], FRONTEND_CWD);
        await waitForUrl(FRONTEND_URL, 'Frontend');
      }

      on('after:run', () => {
        stopProcess(frontendProcess);
        stopProcess(apiProcess);
      });

      return config;
    }
  }
});
