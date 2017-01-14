'use strict';

const readRemoveFile = require('.');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');
const pathExists = require('path-exists');

test('readRemoveFile()', t => {
  t.plan(5);

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
    t.strictEqual(data, 'bar', 'should support the second parameter of fs.readFile.');
  })
  .catch(t.fail);

  readRemoveFile('this/file/does/not/exist').then(t.fail, err => {
    t.strictEqual(err.code, 'ENOENT', 'should fail when it cannot read the file.');
  }).catch(t.fail);

  readRemoveFile({invalid: 'argument'}).then(t.fail, err => {
    t.strictEqual(err.message, 'path must be a string or Buffer', 'should fail when it takes an invalid argument.');
  }).catch(t.fail);
});
