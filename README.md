# read-remove-file

[![Build Status](https://img.shields.io/travis/shinnn/node-read-remove-file.svg?style=flat)](https://travis-ci.org/shinnn/node-read-remove-file)
[![Build status](https://ci.appveyor.com/api/projects/status/pf1uwmte81vpis5b?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/node-read-remove-file)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/node-read-remove-file.svg?style=flat)](https://coveralls.io/r/shinnn/node-read-remove-file)
[![Dependency Status](https://david-dm.org/shinnn/node-read-remove-file.svg?style=flat)](https://david-dm.org/shinnn/node-read-remove-file)
[![devDependency Status](https://david-dm.org/shinnn/node-read-remove-file/dev-status.svg?style=flat)](https://david-dm.org/shinnn/node-read-remove-file#info=devDependencies)

Read a file, then remove it

```javascript
var fs = require('fs');
var readRemoveFile = require('read-remove-file');

readRemoveFile('path/to/file', function(err, buf) {
  if (err) {
    throw err;
  }

  buf; //=> <Buffer ... >
  fs.existsSync('path/to/file'); //=> false
});
```

## Installation

[![NPM version](https://img.shields.io/npm/v/read-remove-file.svg?style=flat)](https://www.npmjs.com/package/read-remove-file)

[Use npm.](https://docs.npmjs.com/cli/install)

```sh
npm install read-remove-file
```

## API

```javascript
var readRemoveFile = require('read-remove-file');
```

### readRemoveFile(*filePath* [, *options*], *callback*)

*filePath*: `String`  
*options*: `Object`  
*callback*: `Function`

It reads a file with [fs.readFile], removes the file and its ancestor directories, and runs the callback function.

*Note that when it runs the callback, the file and directories have been already removed.*

If the path is a relative path, it removes all directories included in the path.

```javascript
readRemoveFile('foo/bar/baz', function(err, buf) {
  if (err) {
    throw err;
  }

  buf; //=> <Buffer ... >

  fs.existsSync('foo/bar/baz'); //=> false
  fs.existsSync('foo/bar'); //=> false
  fs.existsSync('foo'); //=> false
  fs.existsSync('./'); //=> true
});
```

If the path is an absolute path, it doesn't remove any directories. In this case, it removes only a file.

```javascript
readRemoveFile('/foo/bar/baz', function(err, buf) {
  if (err) {
    throw err;
  }

  buf; //=> <Buffer ... >

  fs.existsSync('/foo/bar/baz'); //=> false

  fs.existsSync('/foo/bar'); //=> true
  fs.existsSync('/foo'); //=> true
  fs.existsSync('/'); //=> true
});
```

#### options

You can use all [fs.readFile] options and [`cwd` option](#optionscwd).

##### options.cwd

Type: `String`  
Default: `undefined` (disabled)

The target becomes relative to this path but the directories specified in this option won't be removed.

```javascript
readRemoveFile('foo/bar/baz', {}, function() {
  fs.existsSync('foo/bar'); //=> false
  fs.existsSync('foo'); //=> false
});

readRemoveFile('bar/baz', {cwd: 'foo'}, function() {
  fs.existsSync('foo/bar'); //=> false
  fs.existsSync('foo'); //=> true
});
```

#### callback(*error*, *data*)

*error*: `Error` or `null`  
*data*: [`Buffer`](http://nodejs.org/api/buffer.html#buffer_class_buffer) or `String` (according to `encoding` option)

The first argument will be an `Error` if it fails to read a file, or fails to remove the file or directories. It will be `null` only if both reading the file and removing directories succeeded.

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[fs.readFile]: http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
