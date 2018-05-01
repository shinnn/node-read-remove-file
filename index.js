'use strict';

const {promisify} = require('util');
const {readFile, unlink} = require('graceful-fs');

const readFileP = promisify(readFile);
const unlinkP = promisify(unlink);

module.exports = async function readRemoveFile(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new RangeError(`Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const data = await readFileP(...args);
	await unlinkP(args[0]);

	return data;
};
