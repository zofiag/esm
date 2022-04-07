## Why

An example repro repository to present a following issue.

There's a common pattern to point `main` or `module` to a barrel file, which contains exports from other files.
An example dependency `@aws-sdk/client-s3` has a `module` entry which points to a es module version of their code. This file contains only `export *` entries. Even though it's an es modules version, Node still treats it as a CommonJS and throws an error.

## Intro

```
npm install
npm run run
```

Expected result:
No errors, node can run built files (`dist/index.js`).

Actual result:
`node_modules/@aws-sdk/client-s3/dist-es/index.js` is considered CommonJS even though it is not. That file contains `export *` entries that point to other es modules files.

```
file:///.../esm/dist/index.js:2
import { S3Client } from "../node_modules/@aws-sdk/client-s3/dist-es/index.js";
         ^^^^^^^^
SyntaxError: Named export 'S3Client' not found. The requested module '../node_modules/@aws-sdk/client-s3/dist-es/index.js' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '../node_modules/@aws-sdk/client-s3/dist-es/index.js';
const { S3Client } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:127:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:191:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:337:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:61:12)
Error - exit Error: exit code 1
    at ChildProcess.<anonymous> (file:///.../esm/build.js:35:37)
    at ChildProcess.emit (node:events:520:28)
    at Process.ChildProcess._handle.onexit (node:internal/child_process:291:12)
```
