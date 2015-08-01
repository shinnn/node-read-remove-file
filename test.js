/* eslint no-shadow: 0 */
'use strong';

const path = require('path');

const fs = require('graceful-fs');
const isDir = require('is-dir');
const outputFileSync = require('output-file-sync');
const readRemoveFile = require('./');
const rimraf = require('rimraf');
const test = require('tape');

test('readRemoveFile()', t => {
  t.plan(18);

  fs.writeFileSync('tmp_file0', 'foo');

  readRemoveFile('tmp_file0', (err, buf) => {
    t.deepEqual([err, buf], [null, new Buffer('foo')], 'should read a file.');

    fs.stat('tmp_file0', err => t.equal(err.code, 'ENOENT', 'should remove a file.'));
  });

  outputFileSync('tmp0/file', 'bar');

  readRemoveFile('tmp0/file', null, (err, buf) => {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('bar')],
      'should read content of a file under the new directory.'
    );

    fs.stat('tmp0', err => t.equal(err.code, 'ENOENT', 'should remove a directory.'));
  });

  outputFileSync('tmp1/nested/file', 'baz');

  readRemoveFile('nested/file', {cwd: 'tmp1', encoding: 'hex'}, (err, buf) => {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('baz').toString('hex')],
      'should accept fs.readFile options.'
    );

    isDir('tmp1', (err, result) => {
      t.deepEqual(
        [err, result],
        [null, true],
        'should not remove th file specified in `cwd` option.'
      );

      fs.stat('tmp1/nested', err => {
        t.equal(err.code, 'ENOENT', 'should remove a directory in response to `cwd` option.');
      });

      fs.writeFileSync('tmp1/file', 'qux');

      readRemoveFile(path.resolve('tmp1/file'), (err, buf) => {
        t.deepEqual(
          [err, buf],
          [null, new Buffer('qux')],
          'should read a file specified with an absolute path.'
        );

        isDir('tmp1', (err, result) => {
          t.deepEqual(
            [err, result],
            [null, true],
            'should not remove any directories when the path is absolute.'
          );
        });

        fs.stat('tmp1/file', err => {
          t.equal(err.code, 'ENOENT', 'should remove a file specified with an absolute path.');
        });
      });
    });
  });

  fs.writeFileSync('tmp_file1', 'quux');

  readRemoveFile('node_modules/.././tmp_file1', {cwd: process.cwd()}, (err, buf) => {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('quux')],
      'should read a file in response to `cwd` option.'
    );

    fs.stat('tmp_file1', err => {
      t.equal(
        err.code,
        'ENOENT',
        'should remove a file specified using `cwd` option with absolute path.'
      );
    });

    isDir('/', (err, result) => {
      t.deepEqual(
        [err, result],
        [null, true],
        'should not remove the root directory.'
      );
    });
  });

  readRemoveFile('node_modules', err => {
    t.equal(err.code, 'EISDIR', 'should pass the fs.readFile error to the callback.');
  });

  /* istanbul ignore if */
  if (process.platform === 'win32') {
    t.skip();
  } else {
    outputFileSync('tmp2/file', 'abc123');
    fs.chmodSync('tmp2/', '444');

    readRemoveFile('./tmp2/file', err => {
      t.equal(err.code, 'EACCES', 'should pass rimraf\'s error to the callback.');
      fs.chmodSync('tmp2', '755');
    });
  }

  t.throws(
    () => readRemoveFile(true, t.fail),
    /TypeError.*path/,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    () => readRemoveFile('foo', {}),
    /TypeError.*must be a function/,
    'should throw a type error when the last argument is not a funtion.'
  );

  t.throws(
    () => readRemoveFile('foo', true, t.fail),
    /TypeError/,
    'should throw a type error when the second argument is not a function or object.'
  );

  t.on('end', () => rimraf.sync('tmp*'));
});
