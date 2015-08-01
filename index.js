/*!
 * read-remove-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-read-remove-file
*/
'use strict';

const path = require('path');

const fs = require('graceful-fs');
const rimraf = require('rimraf');
const stripBom = require('strip-bom');

module.exports = function readRemoveFile(filePath, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  } else {
    options = options || {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError(
      String(cb) +
      ' is not a function. Last argument to read-remove-file must be a function.'
    );
  }

  let readFilePath;
  if (options.cwd) {
    readFilePath = path.join(options.cwd, filePath);
  } else {
    readFilePath = filePath;
  }

  fs.readFile(readFilePath, options, function readFileCallback(readErr, buf) {
    if (readErr) {
      cb(readErr);
      return;
    }

    let removePath;

    if (path.isAbsolute(readFilePath)) {
      removePath = filePath;
    } else {
      const dir = path.normalize(path.dirname(filePath));

      if (dir === '.') {
        removePath = readFilePath;
      } else {
        const firstDir = dir.split(path.sep)[0];

        if (options.cwd) {
          removePath = path.join(options.cwd, firstDir);
        } else {
          removePath = firstDir;
        }
      }
    }

    rimraf(removePath, {disableGlob: true}, function rimrafCallback(removeErr) {
      cb(removeErr, stripBom(buf));
    });
  });
};
