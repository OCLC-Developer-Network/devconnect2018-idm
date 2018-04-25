const accessToken = require('./mocks/AccessTokenMock');
const fs = require('fs');
const yaml = require('js-yaml');
const get_config = require("../src/config.js");

global.config = yaml.load(get_config("test"));
let app = require('../src/server');
app.set('accessToken', accessToken)

exports.moxios = require('moxios');
exports.nock = require('nock');
exports.user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/userResponse.json')).toString();
exports.error_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/errorResponse.json')).toString();
exports.access_token_error = fs.readFileSync(require('path').resolve(__dirname, './mocks/access_token_error.json')).toString();
exports.app = app;