'use strict';

const {join} = require('path');
const {writeFile} = require('fs/promises'); // eslint-disable-line node/no-missing-require

const readRemoveFile = require('.');
const test = require('tape');
const pathExists = require('path-exists');

test('readRemoveFile()', async t => {
	t.plan(7);

	(async () => {
		const tmp = join(__dirname, 'tmp_file0');

		await writeFile(tmp, 'foo');
		t.ok(
			Buffer.from('foo').equals(await readRemoveFile(tmp)),
			'should read a file.'
		);
		t.notOk(await pathExists('tmp_file0'), 'should remove a file.');
	})();

	(async () => {
		const tmp = join(__dirname, 'tmp_file1');

		await writeFile(tmp, 'bar');
		t.equal(
			await readRemoveFile(tmp, 'utf8'),
			'bar',
			'should support the second parameter of fs.readFile.'
		);
	})();

	(async () => {
		try {
			await readRemoveFile('this/file/does/not/exist');
		} catch ({code}) {
			t.equal(code, 'ENOENT', 'should fail when it cannot read the file.');
		}
	})();

	try {
		await readRemoveFile({invalid: 'argument'});
	} catch ({code}) {
		t.equal(
			code,
			'ERR_INVALID_ARG_TYPE',
			'should fail when it takes an invalid argument.'
		);
	}

	try {
		await readRemoveFile();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await readRemoveFile('a', {b: 'c'}, 'd');
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
		);
	}
});
