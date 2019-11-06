const accessToken = require('./mocks/AccessTokenMock');
const fs = require('fs');
const yaml = require('js-yaml');
const express = require('express');
const session = require('express-session')
const get_config = require("../src/config.js");

global.config = yaml.load(get_config("test"));

let app = express();
app.use(session({secret: 'Nx^P6u', cookie: {secure: false, maxAge: 60000}, resave: false, saveUninitialized: false}));
app.use(function (req, res, next) {
    //authenticated(req, res, next);
    //OR
    req.session.accessToken = accessToken;
    next();
});

let coreApp = require('../src/server');
app.use(coreApp);

exports.moxios = require('moxios');
exports.nock = require('nock');
exports.user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/userResponse.json')).toString();
exports.error_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/errorResponse.json')).toString();
exports.access_token_error = fs.readFileSync(require('path').resolve(__dirname, './mocks/access_token_error.json')).toString();
exports.single_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/readUserResponse.json')).toString();
exports.search_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/searchResponse.json')).toString();
exports.create_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/createUserResponse.json')).toString();
exports.update_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/updateUserResponse.json')).toString();exports.app = app;