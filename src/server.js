"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const nodeauth = require("nodeauth");

//classes for SCIM
const User = require("./User.js")
const UserError = require("./UserError.js")

const options = {
	    services: ["SCIM", "refresh_token"],
	    redirectUri: "http://localhost:8000/myaccount"
	};

const wskey = new nodeauth.Wskey(config['wskey'], config['secret'], options);

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views'); 
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function getAccessToken (req, res, next){
	if (req.query['error']){
		res.render('display-error', {error: req.query['error'], error_message: req.query['error_description'], error_detail: ""});
	} else if (app.get('accessToken') && app.get('accessToken').getAccessTokenString() && !app.get('accessToken').isExpired()){
		next()
	} else if (app.get('accessToken') && !app.get('accessToken').refreshToken.isExpired()) {	
		app.get('accessToken').refresh();
        next();
	} else if (req.query['code']) {	
		// request an Access Token
		wskey.getAccessTokenWithAuthCode(req.query['code'], config['institution'], config['cxt_institution'])
	        .then(function (accessToken) {
	        	app.set('accessToken', accessToken);
	            //redirect to the state parameter
	            let state = decodeURIComponent(req.query['state']);
	            res.redirect(state);
	        })
	        .catch(function (err) {
	            //catch the error
	        	let error = new UserError(err);
	        	res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	        })
	}else {	
		// redirect to login + state parameter
		res.redirect(wskey.getLoginURL(config['institution'], config['cxt_institution']) + "&state=" + encodeURIComponent(req.originalUrl));
	}
}

app.use(function (req, res, next) {
	getAccessToken(req, res, next);
});

app.get('/', (req, res) => {   
	res.render('index');
});
 
app.get('/myaccount', (req, res) => {   
	User.self(config['institution'], app.get('accessToken').getAccessTokenString())
	.then(user => {
		res.render('display-my-account', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.get('/search', (req, res) => {   
	res.render('search-form');
});

app.post('/search', (req, res) => {   
	let query = req.body.query;
	User.search("ExternalID", query, config['cxt_institution'], app.get('accessToken').getAccessTokenString())
	.then(user => {
		res.render('display-user', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.get('/user/:id', (req, res) => {
	let id = req.params['id'];
	User.find(id, config['cxt_institution'], app.get('accessToken').getAccessTokenString())
	.then(user => {
		res.render('display-user', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});


//Server
module.exports = app;