'use strict';

const readRemoveFile = require('.');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');
const pathExists = require('path-exists');

test('readRemoveFile()', t => {
  t.plan(7);

  writeFileAtomically('tmp_file0', 'foo')
  .then(() => readRemoveFile('tmp_file0'))
  .then(data => {
    t.ok(Buffer.from('foo').equals(data), 'should read a file.');
    return pathExists('tmp_file0');
  })
  .then(exists => t.notOk(exists, 'should remove a file.'))
  .catch(t.fail);

  writeFileAtomically('tmp_file1', 'bar')
  .then(() => readRemoveFile('tmp_file1', 'utf8'))
  .then(data => {
    t.equal(data, 'bar', 'should support the second parameter of fs.readFile.');
  })
  .catch(t.fail);

  readRemoveFile('this/file/does/not/exist').then(t.fail, err => {
    t.equal(err.code, 'ENOENT', 'should fail when it cannot read the file.');
  }).catch(t.fail);

  readRemoveFile().catch(err => {
    t.equal(
      err.toString(),
      'RangeError: Expected 1 or 2 arguments (path: <string>[, options: Object]), but got no arguments.',
      'should fail when it takes no arguments.'
    );
  });

  readRemoveFile('a', {b: 'c'}, 'd').catch(err => {
    t.equal(
      err.toString(),
      'RangeError: Expected 1 or 2 arguments (path: <string>[, options: Object]), but got 3 arguments.',
      'should fail when it takes too many arguments.'
    );
  });

  readRemoveFile({invalid: 'argument'}).then(t.fail, err => {
    t.equal(err.message, 'path must be a string or Buffer', 'should fail when it takes an invalid argument.');
  }).catch(t.fail);
});
