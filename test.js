/* eslint no-shadow: 0 */
'use strict';

var path = require('path');

var fs = require('graceful-fs');
var isDir = require('is-dir');
var outputFileSync = require('output-file-sync');
var readRemoveFile = require('./');
var rimraf = require('rimraf');
var test = require('tape');

test('readRemoveFile()', function(t) {
  t.plan(18);

  fs.writeFileSync('tmp_file0', 'foo');

  readRemoveFile('tmp_file0', function(err, buf) {
    t.deepEqual([err, buf], [null, new Buffer('foo')], 'should read a file.');

    fs.stat('tmp_file0', function(err) {
      t.equal(err.code, 'ENOENT', 'should remove a file.');
    });
  });

  outputFileSync('tmp0/file', 'bar');

  readRemoveFile('tmp0/file', null, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('bar')],
      'should read content of a file under the new directory.'
    );

    fs.stat('tmp0', function(err) {
      t.equal(err.code, 'ENOENT', 'should remove a directory.');
    });
  });

  outputFileSync('tmp1/nested/file', 'baz');

  readRemoveFile('nested/file', {cwd: 'tmp1', encoding: 'hex'}, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('baz').toString('hex')],
      'should accept fs.readFile options.'
    );

    isDir('tmp1', function(err, result) {
      t.deepEqual(
        [err, result],
        [null, true],
        'should not remove th file specified in `cwd` option.'
      );

      fs.stat('tmp1/nested', function(err) {
        t.equal(err.code, 'ENOENT', 'should remove a directory in response to `cwd` option.');
      });

      fs.writeFileSync('tmp1/file', 'qux');

      readRemoveFile(path.resolve('tmp1/file'), function(err, buf) {
        t.deepEqual(
          [err, buf],
          [null, new Buffer('qux')],
          'should read a file specified with an absolute path.'
        );

        isDir('tmp1', function(err, result) {
          t.deepEqual(
            [err, result],
            [null, true],
            'should not remove any directories when the path is absolute.'
          );
        });

        fs.stat('tmp1/file', function(err) {
          t.equal(err.code, 'ENOENT', 'should remove a file specified with an absolute path.');
        });
      });
    });
  });

  fs.writeFileSync('tmp_file1', 'quux');

  readRemoveFile('node_modules/.././tmp_file1', {cwd: process.cwd()}, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('quux')],
      'should read a file in response to `cwd` option.'
    );

    fs.stat('tmp_file1', function(err) {
      t.equal(
        err.code,
        'ENOENT',
        'should remove a file specified using `cwd` option with absolute path.'
      );
    });

    isDir('/', function(err, result) {
      t.deepEqual(
        [err, result],
        [null, true],
        'should not remove the root directory.'
      );
    });
  });

  readRemoveFile('node_modules', function(err) {
    t.equal(err.code, 'EISDIR', 'should pass the fs.readFile error to the callback.');
  });

  /* istanbul ignore if */
  if (process.platform === 'win32') {
    t.skip();
  } else {
    outputFileSync('tmp2/file', 'abc123');
    fs.chmodSync('tmp2/', '444');

    readRemoveFile('./tmp2/file', function(err) {
      t.equal(err.code, 'EACCES', 'should pass rimraf\'s error to the callback.');
      fs.chmodSync('tmp2', '755');
    });
  }

  t.throws(
    readRemoveFile.bind(null, true, t.fail),
    /TypeError.*path/,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    readRemoveFile.bind(null, 'foo', {}),
    /TypeError.*must be a function/,
    'should throw a type error when the last argument is not a funtion.'
  );

  t.throws(
    readRemoveFile.bind(null, 'foo', true, t.fail),
    /TypeError/,
    'should throw a type error when the second argument is not a function or object.'
  );

  t.on('end', function() {
    rimraf.sync('tmp*');
  });
});
