"use strict";
const express = require('express');
const session = require('express-session')
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
app.use(session({secret: 'Nx^P6u', cookie: {secure: false, maxAge: 60000}, resave: false, saveUninitialized: false}));

function getAccessToken (req, res, next){
	// this is messed up because a session can't store an object
	let cxt_institution;
	if (req.body.institution){
		cxt_institution = req.body.institution;
	} else if (req.originalUrl === "/myaccount") {
		cxt_institution = config['institution'];
	} else {
		cxt_institution = config['institution'];
	}
	
	if (req.query['error']){
		res.render('display-error', {error: req.query['error'], error_message: req.query['error_description'], error_detail: ""});
	} else if (req.session.accessToken && req.session.accessToken.accessTokenString){
		if (req.session.accessToken.contextInstitutionId != cxt_institution){
			// make a CCG request for a token with the right cxt_institution
			wskey.getAccessTokenWithClientCredentials(config['institution'], cxt_institution, req.session.accessToken.user)
	        .then(function (accessToken) {
	        	req.session.accessToken = accessToken;
	            next();
	        })
	        .catch(function (err) {
	            //catch the error
	        	let error = new UserError(err);
	        	res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	        })
		} else {
			next()
		}
	} else if (req.session.accessToken && req.session.accessToken.refreshToken) {	
		// need to figure out how to use a refresh token when don't have an Access Token object anymore
        next();
	} else if (req.query['code']) {
		// request an Access Token
		wskey.getAccessTokenWithAuthCode(req.query['code'], config['institution'], cxt_institution)
	        .then(function (accessToken) {
	        	req.session.accessToken = accessToken;
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
		let loginURL = wskey.getLoginURL(config['institution'], cxt_institution, encodeURIComponent(req.originalUrl));
		res.redirect(loginURL);
	}
}

app.use(function (req, res, next) {
	getAccessToken(req, res, next);
});

app.get('/', (req, res) => {   
	res.render('index');
});
 
app.get('/myaccount', (req, res) => {   
	User.self(config['institution'], req.session.accessToken.accessTokenString)
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
	let cxt_institution = req.body.institution;
	let query = req.body.query;
	User.search("External_ID", query, cxt_institution, req.session.accessToken.accessTokenString)
	.then(users => {
		res.render('display-user', {user: users[0]});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.get('/user', (req, res) => {
	res.render('lookup-form');
});

app.post('/user', (req, res) => {
	let cxt_institution = req.body.institution;
	let id = req.body.id;
	User.find(id, cxt_institution, req.session.accessToken.accessTokenString)
	.then(user => {
		res.render('display-user', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.get('/user/:id', (req, res) => {
	let id = req.params['id'];
	User.find(id, config['institution'], req.session.accessToken.accessTokenString)
	.then(user => {
		res.render('display-user', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.get('/create_user', (req, res) => {
	res.render('user-form', {title: "Create User", action: "create_user", user: null});
});

app.post('/create_user', (req, res) => {
	let fields = {
		"familyName": req.body.familyName,
		"givenName": req.body.givenName,
		"email": req.body.email,
		"streetAddress": req.body.streetAddress,
		"locality": req.body.locality,
		"region": req.body.region,
		"postalCode": req.body.postalCode,
		"barcode": req.body.familyName + "_" + req.body.givenName,
		"borrowerCategory": "ADULT",
		"homeBranch": "129479"
		};
	
	User.add(fields, config['institution'], req.session.accessToken.accessTokenString)
	.then(user => {
		res.render('display-user', {user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.get('/update_user/:id', (req, res) => {
	let id = req.params['id'];
	User.find(id, config['institution'], req.session.accessToken.accessTokenString)
	.then(user => {
		app.set('user', user);
		res.render('user-form', {title: "Update User", action: "update_user", user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

app.post('/update_user/:id', (req, res) => {
	// figure out which fields need to be updated and update them
	let user = app.get('user');
	user.setGivenName(req.body.givenName);
	user.setMiddleName(req.body.MiddleName);
	user.setFamilyName(req.body.FamilyName);
	user.setEmail(req.body.email);
	user.setAddress(0, req.body.streetAddress, req.body.locality, req.body.region, req.body.postalCode);
	
	User.update(user, config['institution'], req.session.accessToken.accessTokenString)
    	.then(user => {
		res.render('user-form', {title: "Update User", action: "update_user", user: user});
	})
	.catch (error => {
		res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
	})
});

//Server
module.exports = app;