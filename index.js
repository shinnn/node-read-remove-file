'use strict';

const {promisify} = require('util');
const {readFile, unlink} = require('fs');

const promisifiedReadFile = promisify(readFile);
const promisifiedUnlink = promisify(unlink);

module.exports = async function readRemoveFile(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new RangeError(`Expected 1 or 2 arguments (path: <string|Buffer|Uint8Array|URL|integer>[, options: <Object|string>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const data = await promisifiedReadFile(...args);
	await promisifiedUnlink(args[0]);

	return data;
};
