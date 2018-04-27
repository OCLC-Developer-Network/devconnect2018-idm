const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("routes", function(){
	before(() => {
		helper.moxios.install()
		helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
			status: 200,
			responseText: helper.user_response
		}); 
	})
	
	after(() => {
		helper.moxios.uninstall()
	})
	
  describe("#index", function(){
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/").then(response => {
	            expect(response.statusCode).to.equal(200);
	            expect(response.text).to.have.string("Yes!!! The user is logged in!");
	        })
	    });
  });
  
  describe("#myaccount", function(){ 
	  it('It should response the GET method', async() => {
	    	let response = await request(helper.app).get("/myaccount");
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200)
            expect($('div#content h1').text()).to.have.string("Welcome Karen");
            expect($('p#name').text()).to.have.string("Name: Coombs Karen");
            expect($('p#email').text()).to.have.string("Email: coombsk@oclc.org");
            expect($('p#id').text()).to.have.string("ID/Namespace: 412d947b-144e-4ea4-97f5-fd6593315f17 - urn:oclc:platform:127950");
            expect($('p#institution').text()).to.have.string("Institution: 128807");
	    });
	  }); 
});
