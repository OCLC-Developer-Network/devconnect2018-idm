"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const nodeauth = require("nodeauth");

//classes for SCIM
const User = require("./User.js")
const UserError = require("./UserError.js")

const options = {
	    services: ["SCIM:read_self", "refresh_token"],
	    redirectUri: "http://localhost:8000/myaccount"
	};

const wskey = new nodeauth.Wskey(config['wskey'], config['secret'], options);

const app = express();

this.accessToken = null;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views'); 
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const context = this;

function getAccessToken (req, res, next){
	if (req.query['error']){
		res.render('display-error', {error: req.query['error'], error_message: req.query['error_description'], error_detail: ""});
	} else if (context.accessToken && context.accessToken.getAccessTokenString() && !context.accessToken.isExpired()){
		next()
	} else if (context.accessToken && !context.accessToken.refreshToken.isExpired()) {	
		context.accessToken.refresh();
        next();
	} else if (req.query['code']) {	
		// request an Access Token
		wskey.getAccessTokenWithAuthCode(req.query['code'], config['institution'], config['institution'])
	        .then(function (accessToken) {
	            context.accessToken = accessToken;
	            //redirect to the state parameter
	            let state = decodeURIComponent(req.params['state']);
	            res.redirect(state);
	        })
	        .catch(function (err) {
	            //catch the error
	        	let error = new RequestError(err);
	        	res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	        })
	}else {	
		// redirect to login + state parameter
		res.redirect(wskey.getLoginURL(config['institution'], config['institution']) + "&state=" + encodeURIComponent(req.originalUrl));
	}
}

app.use(function (req, res, next) {
	getAccessToken(req, res, next);
});

app.get('/', (req, res) => {   
	res.render('index');
});
 
app.get('/myaccount', (req, res) => {   
	User.find(context.accessToken.getAccessTokenString())
	.then(user => {
		res.render('display-user', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage()});
	})
});


//Server
module.exports = app;