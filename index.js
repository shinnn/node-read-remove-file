/*!
 * read-remove-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-read-remove-file
*/
'use strict';

const fs = require('graceful-fs');
const runSeries = require('run-series');

module.exports = function readRemoveFile(filePath, options) {
  return new Promise((resolve, reject) => {
    runSeries([
      cb => fs.readFile(filePath, options, cb),
      cb => fs.unlink(filePath, cb)
    ], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(results[0]);
    });
  });
};
