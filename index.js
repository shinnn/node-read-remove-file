'use strict';

const {promisify} = require('util');
const {readFile, unlink} = require('graceful-fs');

const readFileP = promisify(readFile);
const unlinkP = promisify(unlink);

module.exports = async function readRemoveFile(...args) {
  const argLen = args.length;

  if (argLen !== 1 && argLen !== 2) {
    return Promise.reject(new RangeError(`Expected 1 or 2 arguments (path: <string>[, options: Object]), but got ${
      argLen === 0 ? 'no' : argLen
    } arguments.`));
  }

  const [filePath, options] = args;

  const data = await readFileP(filePath, options);
  await unlinkP(filePath);

  return data;
};
