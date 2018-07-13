'use strict';

const Fs = require('fs');
const Util = require('util');
const Path = require('path');
const Postcss = require('postcss');
const Cssnano = require('cssnano');
const Package = require('./package');
const Cssnext = require('postcss-cssnext');

const ReadFolder = Util.promisify(Fs.readdir);
const ReadFile = Util.promisify(Fs.readFile);
const WriteFile = Util.promisify(Fs.writeFile);

const header = `/*
	Name: ${Package.name}
	Version: ${Package.version}
	License: ${Package.license}
	Author: ${Package.author}
	Email: ${Package.email}
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
`;

const build = async function (name, next) {
	let result;

	const data = await ReadFile('src/' + name + '.css');

	// regular
	if (next) {
		result = await Postcss([Cssnext]).process(data, {
			from: 'src/' + name + '.css',
			to: 'dis/' + name + '.css'
		});
	} else {
		result = {};
		result.css = data;
	}

	WriteFile('dis/' + name + '.css', `${header}${result.css}`);

	// minified
	result = await Postcss([Cssnano]).process(result.css, {
		from: 'src/' + name  + '.css',
		to: 'dis/'  + name + '.min.css'
	});

	WriteFile('dis/' + name + '.min.css', `${header}${result.css}`);

};

(async function() {

	const items = await ReadFolder('src');

	for (let item of items) {
		let name = Path.basename(item, '.css');
		await build(name, name === 'boxers');
	}

}()).catch(function (error) {
	console.error(error);
});
