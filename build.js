'use strict';

const Fs = require('fs');
const Util = require('util');
const Postcss = require('postcss');
const Cssnano = require('cssnano');
const Package = require('./package');
const Cssnext = require('postcss-cssnext');

const ReadFile = Util.promisify(Fs.readFile);
const WriteFile = Util.promisify(Fs.writeFile);

const header = `/*
	Name: Boxers
	Version: ${Package.version}
	License: MPL-2.0
	Author: Alexander Elias
	Email: alex.steven.elias@gmail.com
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
`;

(async function() {

	let result;
	const options = { from: 'src/boxers.css', to: 'dis/boxers.css' };
	const data = await ReadFile('src/index.css');

	result = await Postcss([Cssnext]).process(data, options);

	WriteFile('dis/boxers.css', `${header}${result.css}`);

	result = await Postcss([Cssnano]).process(result.css, options);

	WriteFile('dis/boxers.min.css', `${header}${result.css}`);

}()).catch(function (error) {
	console.error(error);
});
