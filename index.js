/*!
 * read-remove-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-read-remove-file
*/
'use strict';

var path = require('path');

var fs = require('graceful-fs');
var rimraf = require('rimraf');
var stripBom = require('strip-bom');

module.exports = function readRemoveFile(filePath, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  } else {
    options = options || {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError(
      cb +
      ' is not a function. Last argument to read-remove-file must be a function.'
    );
  }

  var readFilePath;
  if (options.cwd) {
    readFilePath = path.join(options.cwd, filePath);
  } else {
    readFilePath = filePath;
  }

  fs.readFile(readFilePath, options, function(readErr, buf) {
    if (readErr) {
      cb(readErr);
      return;
    }

    var removePath;

    if (path.isAbsolute(readFilePath)) {
      removePath = filePath;
    } else {
      var dir = path.normalize(path.dirname(filePath));

      if (dir === '.') {
        removePath = readFilePath;
      } else {
        var firstDir = dir.split(path.sep)[0];

        if (options.cwd) {
          removePath = path.join(options.cwd, firstDir);
        } else {
          removePath = firstDir;
        }
      }
    }

    rimraf(removePath, function(removeErr) {
      cb(removeErr, stripBom(buf));
    });
  });
};
