/*!
 * read-remove-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-read-remove-file
*/
'use strict';

const {promisify} = require('util');
const {readFile, unlink} = require('graceful-fs');

const readFileP = promisify(readFile);
const unlinkP = promisify(unlink);

module.exports = async function readRemoveFile(filePath, options) {
  const data = await readFileP(filePath, options);
  await unlinkP(filePath);

  return data;
};
