const request = require('supertest');
const expect = require('chai').expect;
let helper = require('./testHelper');

describe("routes", function(){
  beforeEach(() => {
	  helper.moxios.install();
  });
  
  afterEach(() => {
	  helper.moxios.uninstall();
  });
  describe("#index", function(){
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/").then(response => {
	            expect(response.statusCode).to.equal(200);
	            expect(response.text).to.have.string("Yes!!! The user is logged in!");
	        })
	    });
  });
});
  
  describe("#myaccount", function(){
      helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
          status: 200,
          responseText: helper.user_response
        });
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/myaccount").then(response => {
	            expect(response.statusCode).to.equal(200)
	        })
	    });
	  }); 
  
  describe.only("#Error", function(){
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/?error=invalid_client_id&error_description=WSKey+is+invalid&http_code=401&state=%2Fmyaccount").then(response => {
	            expect(response.statusCode).to.equal(200);
	            expect(response.text).to.have.string("System Error");
	            expect(response.text).to.have.string("Status - invalid_client_id");
	            expect(response.text).to.have.string("Message - WSKey is invalid");
	        })
	    });
	  });
  
  describe("#accessTokenError", function(){
	  helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
		  status: 401,
		  responseText: helper.error_response
	  });
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/myaccount").then(response => {
	            expect(response.statusCode).to.equal(200)
	        })
	    });
});
