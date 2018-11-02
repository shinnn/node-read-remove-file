# read-remove-file

[![npm version](https://img.shields.io/npm/v/read-remove-file.svg)](https://www.npmjs.com/package/read-remove-file)
[![Build Status](https://travis-ci.org/shinnn/node-read-remove-file.svg?branch=master)](https://travis-ci.org/shinnn/node-read-remove-file)
![Coverage Status](https://coveralls.io/repos/github/shinnn/node-read-remove-file/badge.svg?branch=master)](https://coveralls.io/github/shinnn/node-read-remove-file?branch=master)

Read a file, then remove it

```javascript
const {access} = require('fs').promises;
const readRemoveFile = require('read-remove-file');

(async () => {
  const buf = await readRemoveFile('path/to/a/file'); //=> <Buffer ... >
  await access('path/to/a/file'); // Error: ENOENT
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install read-remove-file
```

## API

```javascript
const readRemoveFile = require('read-remove-file');
```

### readRemoveFile(*path* [, *options*])

*path*: `string` `Buffer` `Uint8Array` `URL` (a file path) or `integer` (a file descriptor)  
*options*: `Object` or `string` ([`fs.readFile`][fs.readFile] options)  
Return: `Promise<Buffer|string>`

It [reads a file][fs.readFile], [removes the file](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback) and returns a `Promise` of the file contents.

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe

[fs.readFile]: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
