const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const UserError = require('../src/UserError');
const error_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/errorResponse.json')).toString();
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

describe('Create Error from Access Token Error test', () => {
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
        expect(error.message).to.equal('Authentication failure. Missing or invalid authorization token.')
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
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
    
});
