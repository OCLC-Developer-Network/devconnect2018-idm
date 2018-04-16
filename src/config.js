"use strict";
const fs = require('fs');

module.exports = function get_config(environment) {
	let config = fs.readFileSync(require('path').resolve(__dirname, '../' + environment + '_config.yml')).toString();
	return config;
};