const request = require('supertest');
const expect = require('chai').expect;
let helper = require('./testHelper');

describe("routes", function(){
  describe("#index", function(){
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/").then(response => {
	            expect(response.statusCode).to.equal(200);
	            expect(response.text).to.have.string("Yes!!! The user is logged in!");
	        })
	    });
  });
  
  describe("#myaccount", function(){
	    it('It should response the GET method', () => {
	    	helper.moxios.uninstall()
	        return request(helper.app).get("/myaccount").then(response => {
	            helper.moxios.withMock(function () {
	            	helper.moxios.wait(function () {
	                  let http_request = helper.moxios.requests.mostRecent()
	                  http_request.respondWith({
	                    status: 200,
	                    response: helper.user_response
	                  }).then(function () {
	      	            expect(response.statusCode).to.equal(200)
	    	            expect(response.text).to.have.string("Welcome Karen");
	    	            expect(response.text).to.have.string("Name: Karen Coombs");
	    	            expect(response.text).to.have.string("Email: coombsk@oclc.org");
	    	            expect(response.text).to.have.string("ID/Namespace: 412d947b-144e-4ea4-97f5-fd6593315f17 - urn:oclc:platform:127950");
	    	            expect(response.text).to.have.string("Institution: 128807");
	                    done()
	                  })
	                })
	            })
	        })
	    });
	  }); 
  
  describe("#Error", function(){
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/?error=invalid_client_id&error_description=WSKey+is+invalid&http_code=401&state=%2Fmyaccount").then(response => {
	            expect(response.statusCode).to.equal(200);
	            expect(response.text).to.have.string("System Error");
	            expect(response.text).to.have.string("Status - invalid_client_id");
	            expect(response.text).to.have.string("Message - WSKey is invalid");
	        })
	    });
  });
  
  describe("#SCIM Error", function(){	  
	    it('It should response the GET method', () => {
	    	helper.moxios.uninstall()
	        return request(helper.app).get("/myaccount").then(response => {
	            helper.moxios.withMock(function () {
	            	helper.moxios.wait(function () {
	                  let http_request = helper.moxios.requests.mostRecent();
	                  http_request.respondWith({
	                    status: 401,
	                    response: helper.response_error
	                  }).then(function () {
	      	            expect(response.statusCode).to.equal(200);
	    	            expect(response.text).to.have.string("System Error");
	    	            expect(response.text).to.have.string("Status - 401");
	    	            expect(response.text).to.have.string("Message - WSKey is invalid");
	                    done()
	                  })
	                })
	            })
	        })
	    });
  });  
  
  describe("#accessTokenError", function(){	  
	    it('It should response the GET method', () => {
	    	helper.moxios.uninstall()
	        return request(helper.app).get("/myaccount").then(response => {
	            helper.moxios.withMock(function () {
	            	helper.moxios.wait(function () {
	                  let http_request = helper.moxios.requests.mostRecent();
	                  http_request.respondWith({
	                    status: 401,
	                    response: helper.access_token_error
	                  }).then(function () {
	      	            expect(response.statusCode).to.equal(200);
	    	            expect(response.text).to.have.string("System Error");
	    	            expect(response.text).to.have.string("Status - 401");
	    	            expect(response.text).to.have.string("Message - WSKey is invalid");
	                    done()
	                  })
	                })
	            })
	        })
	    });
  });
});
