# read-remove-file

[![NPM version](https://img.shields.io/npm/v/read-remove-file.svg)](https://www.npmjs.com/package/read-remove-file)
[![Build Status](https://travis-ci.org/shinnn/node-read-remove-file.svg?branch=master)](https://travis-ci.org/shinnn/node-read-remove-file)
[![Build status](https://ci.appveyor.com/api/projects/status/pf1uwmte81vpis5b?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/node-read-remove-file)
[![Coverage Status](https://coveralls.io/repos/github/shinnn/node-read-remove-file/badge.svg?branch=master)](https://coveralls.io/github/shinnn/node-read-remove-file?branch=master)

Read a file, then remove it

```javascript
const readRemoveFile = require('read-remove-file');

readRemoveFile('path/to/file').then(buf => {
  buf; //=> <Buffer ... >
  fs.accessSync('path/to/file'); // Error: ENOENT
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install read-remove-file
```

## API

```javascript
const readRemoveFile = require('read-remove-file');
```

### readRemoveFile(*filePath* [, *options*])

*filePath*: `String`  
*options*: `Object` or `String` ([`fs.readFile`][fs.readFile] options)  
Return: `Promise`

It [reads a file][fs.readFile], [removes the file](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback) and returns a [promise](https://promisesaplus.com/) of the file contents.

```javascript
readRemoveFile('path/to/file', 'utf8').then(str => {
  str; //=> 'file contents'
  fs.accessSync('path/to/file'); // Error: ENOENT
});
```

## License

[Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed)

[fs.readFile]: https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
