const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');
const yaml = require('js-yaml');
const get_config = require("../src/config.js");

global.config = yaml.load(get_config("test"));

const UserError = require('../src/UserError');
const error_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/errorResponse.json')).toString();
const accesstoken_error = fs.readFileSync(require('path').resolve(__dirname, './mocks/access_token_error.json')).toString();
const User = require('../src/User');

const error_mock = require('./mocks/errorMock')
const accesstoken_error_mock = require('./mocks/accessTokenErrorMock')

describe('Create Error test', () => {
	var error;
	  before(() => {
		  	error = new UserError(error_mock);
		  });
	  
	  it('Creates an Error object', () => {
		  expect(error).to.be.an.instanceof(UserError);
	  });
	  
	  it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)
        expect(error.message).to.equal('Authentication failure. Missing or invalid authorization token.')
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
	  });
	  
	});

describe.only('Create Error from Access Token Error test', () => {
	var error;
	  before(() => {
		  	error = new UserError(accesstoken_error_mock);
		  });
	  
	  it('Creates an Error object', () => {
		  expect(error).to.be.an.instanceof(UserError);
	  });
	  
	  it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)
        expect(error.message).to.equal('WSKey \'test\' is invalid')
        expect(error.detail).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"')
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal("WSKey 'test' is invalid")
        expect(error.getDetail()).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"')
	  });
	  
	});


describe('API Error tests', () => {
  beforeEach(() => {
	  moxios.install();
  });
  
  afterEach(() => {
	  moxios.uninstall();
  });

  it('Returns a 401 Error from an HTTP request', () => {
	  moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
		  status: 401,
		  responseText: error_response
	  });
	  
    return User.self(128807, 'tk_12345')
      .catch(error => {
        //expect an Error object back
        expect(error).to.be.an.instanceof(UserError);
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401);
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
        
      });
  }); 
  
  it.skip('Returns a 401 Error from an Access Token request', () => {
	  moxios.stubRequest('https://authn.sd00.worldcat.org/oauth2/accessToken?grant_type=client_credentials&authenticatingInstitutionId=128807&contextInstitutionId=128807&scope=SCIM:read_self', {
		  status: 401,
		  responseText: accesstoken_error
	  });
	const nodeauth = require("nodeauth");
	const options = {
		    services: ["SCIM:read_self"]
		};	
	const user = new nodeauth.User(config['institution'], config['principalID'], config['principalIDNS']);
	const wskey = new nodeauth.Wskey(config['wskey'], config['secret'], options);	  
	  
	return wskey.getAccessTokenWithClientCredentials(config['institution'], config['institution'], user)
      .catch(error => {
        //expect an Error object back
    	let atError = new UserError(error);
        expect(atError).to.be.an.instanceof(UserError);
        expect(atError.getRequestError()).to.be.an.instanceof(Error);
        expect(atError.getCode()).to.equal(401);
        expect(atError.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
        
      });
  });   
    
});
