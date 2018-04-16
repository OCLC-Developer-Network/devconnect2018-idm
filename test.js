const fs = require('fs');
const yaml = require('js-yaml');
const get_config = require("./src/config.js");
const moxios = require('moxios');
const access_token = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/access_token.json')).toString();
const user_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/userResponse.json')).toString();
const error_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/errorResponse.json')).toString();


moxios.install();

// login
//https://authn.sd00.worldcat.org/oauth2/authorizeCode?client_id=test&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost:8000%2Fmyaccount&response_type=code&scope=SCIM%20refresh_token


// get a valid token
moxios.stubRequest('https://authn.sd00.worldcat.org/oauth2/accessToken?grant_type=code&code=auth_12345&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http%3A%2F%2Flocalhost:8000%2Fmyaccount', {
	  status: 200,
	  responseText: access_token
});

moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
    status: 200,
    responseText: user_response
  }); 

//moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
//	  status: 401,
//	  responseText: error_response
//});

let environment = "test";

const decrypt = require("./src/config.js");
global.config = "";
get_config(environment)
	.then(function (output){
		global.config = yaml.load(output);
		let app = require('./src/server.js');
		let port = process.env.PORT || 8000;

		// Server
		app.listen(port, () => {
		    console.log(`Listening on: http://localhost:${port}`);
		});
		
	})
	.catch(function (err){
		throw ('Config failed to load' + err);
	});
