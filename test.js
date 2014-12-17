'use strict';

var path = require('path');

var fs = require('graceful-fs');
var outputFileSync = require('output-file-sync');
var readRemoveFile = require('./');
var rimraf = require('rimraf');
var test = require('tape');

test('readRemoveFile()', function(t) {
  t.plan(18);

  fs.writeFileSync('tmp_file0', 'foo');

  readRemoveFile('tmp_file0', function(err, buf) {
    t.deepEqual([err, buf], [null, new Buffer('foo')], 'should read a file.');

    fs.exists('tmp_file0', function(result) {
      t.notOk(result, 'should remove a file.');
    });
  });

  outputFileSync('tmp0/file', 'bar');

  readRemoveFile('tmp0/file', null, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('bar')],
      'should read content of a file under the new directory.'
    );

    fs.exists('tmp0', function(result) {
      t.notOk(result, 'should remove a directory.');
    });
  });

  outputFileSync('tmp1/nested/file', 'baz');

  readRemoveFile('nested/file', {cwd: 'tmp1', encoding: 'hex'}, function(err, buf) {
    t.deepEqual(
      [err, buf],
      [null, new Buffer('baz').toString('hex')],
      'should accept fs.readFile options.'
    );

    fs.exists('tmp1', function(result) {
      t.ok(result, 'should not remove th file specified in `cwd` option.');

      fs.exists('tmp1/nested', function(result) {
        t.notOk(result, 'should remove a directory in response to `cwd` option.');
      });

      fs.writeFileSync('tmp1/file', 'qux');

      readRemoveFile(path.resolve('tmp1/file'), function(err, buf) {
        t.deepEqual(
          [err, buf],
          [null, new Buffer('qux')],
          'should read a file specified with an absolute path.'
        );

        fs.exists('tmp1', function(result) {
          t.ok(result, 'should not remove any directories when the path is absolute.');
        });

        fs.exists('tmp1/file', function(result) {
          t.notOk(result, 'should remove a file specified with an absolute path.');
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

    fs.exists('tmp_file1', function(result) {
      t.notOk(result, 'should remove a file specified using `cwd` option with absolute path.');
    });

    fs.exists('/', function(result) {
      t.ok(result, 'should not remove the root directory.');
    });
  });

  readRemoveFile('node_modules', function(err) {
    t.equal(err.code, 'EISDIR', 'should pass the fs.readFile error to the callback.');
  });

  outputFileSync('tmp2/file', 'abc123');
  fs.chmodSync('tmp2/', '444');

  readRemoveFile('./tmp2/file', function(err) {
    t.equal(err.code, 'EACCES', 'should pass rimraf\'s error to the callback.');
    fs.chmodSync('tmp2', '755');
  });

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
    rimraf.sync('tmp1');

    /* istanbul ignore else */
    if (process.platform !== 'win32') {
      rimraf.sync('tmp2');
    }
  });
});
