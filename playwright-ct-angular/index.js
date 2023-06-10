/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { test: baseTest, expect, devices, defineConfig: originalDefineConfig } = require('@playwright/test');
const { fixtures } = require('@playwright/experimental-ct-core/lib/mount');
const path = require('path');

process.env['NODE_ENV'] = 'test';

function plugin() {
  // Only fetch upon request to avoid resolution in workers.
  const { createPlugin } = require('@playwright/experimental-ct-core/lib/vitePlugin');
  return createPlugin(
    path.join(__dirname, 'registerSource.mjs'),
    {
      plugins: [import('@analogjs/vite-plugin-angular').then(plugin => {
        if (typeof plugin.default === 'function')
          return plugin.default({ jit: false })
        
        // TODO: fix plugin resolving (default.default)
        return plugin.default.default({ jit: false })
      })],
      build: {
        sourcemap: false, // TODO: set sourcemap true: https://github.com/sand4rt/playwright-ct-angular/issues/6 
        rollupOptions: {
          treeshake: true
        }
      }
    }
  )
};

const test = baseTest.extend(fixtures);
const defineConfig = config => originalDefineConfig({ ...config, _plugins: [plugin] });

module.exports = { test, expect, devices, defineConfig };
