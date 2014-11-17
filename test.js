'use strict';

var path = require('path');

var fs = require('graceful-fs');
var noop = require('nop');
var outputFileSync = require('output-file-sync');
var readRemoveFile = require('./');
var rimraf = require('rimraf');
var test = require('tape');

test('readRemoveFile()', function(t) {
  t.plan(23);

  outputFileSync('tmp_file0', 'foo');

  readRemoveFile('tmp_file0', function(err, buf) {
    t.strictEqual(err, null, 'should read and remove a file.');
    t.strictEqual(buf.toString(), 'foo', 'should read content of a file successflly.');
    t.notOk(fs.existsSync('tmp_file0'), 'should remove a file successflly.');
  });

  outputFileSync('tmp0/file', 'bar');

  readRemoveFile('tmp0/file', null, function(err, buf) {
    t.strictEqual(err, null, 'should read a file and remove a directory.');
    t.strictEqual(
      buf.toString(), 'bar',
      'should read content of a file under the directory successflly.'
    );
    t.notOk(fs.existsSync('tmp0'), 'should remove a directory successfully.');
  });

  outputFileSync('tmp1/nested/file', 'baz');

  readRemoveFile('nested/file', {cwd: 'tmp1', encoding: 'hex'}, function(err, buf) {
    t.strictEqual(err, null, 'should accept `cwd` option.');
    t.strictEqual(buf.toString(), '62617a', 'should accept fs.readFile options.');
    t.notOk(
      fs.existsSync('tmp1/nested'),
      'should remove a directory in response to `cwd` option.'
    );
    t.ok(fs.existsSync('tmp1'), 'should not remove th file specified in `cwd` option.');
    rimraf.sync('tmp1');
  });

  outputFileSync('tmp2/file', 'qux');

  readRemoveFile(path.resolve('tmp2/file'), function(err, buf) {
    t.strictEqual(err, null, 'should accept an absolute path.');
    t.strictEqual(buf.toString(), 'qux', 'should read a file specified with an absolute path.');
    t.notOk(fs.existsSync('tmp2/file'), 'should remove a file specified with an absolute path.');
    t.ok(
      fs.existsSync('tmp2'),
      'should not remove any ancestor directories when the path is absolute.'
    );
    rimraf.sync('tmp2');
  });

  outputFileSync('tmp_file1', 'quux');

  readRemoveFile('tmp_file1', {cwd: process.cwd()}, function(err, buf) {
    t.strictEqual(
      err, null,
      'should not fail even if `cwd` option is specified with an absolute path.'
    );
    t.strictEqual(buf.toString(), 'quux', 'should read a file in response to `cwd` option.');
    t.notOk(
      fs.existsSync('tmp_file1'),
      'should remove a file specified using `cwd` option with absolute path.'
    );
    t.ok(fs.existsSync('/'), 'should not remove the root directory.');
  });

  readRemoveFile('node_modules', function(err) {
    t.equal(err.code, 'EISDIR', 'should pass the fs.readFile error to the callback.');
  });

  outputFileSync('tmp3/file', {mode: 444});
  readRemoveFile('./tmp3/file', function(err) {
    /* istanbul ignore if */
    if (process.platform === 'win32') {
      t.skip();
    } else {
      t.equal(err.code, 'EINVAL', 'should pass rimraf\'s error to the callback.');
    }
    rimraf.sync('tmp3');
  });

  t.throws(
    readRemoveFile.bind(null, true, noop), /TypeError/,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    readRemoveFile.bind(null, 'foo', {}), /TypeError/,
    'should throw a type error when the last argument is not a funtion.'
  );

  t.throws(
    readRemoveFile.bind(null, 'foo', true, noop), /TypeError/,
    'should throw a type error when the second argument is not a function or an object.'
  );
});
