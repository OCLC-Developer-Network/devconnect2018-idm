const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("Error routes", function(){
	before(() => {
		helper.moxios.install()
	})
	
	after(() => {
		helper.moxios.uninstall()
	})

  describe("#SCIM Error", function(){  
	  helper.moxios.stubOnce('GET', 'https://128807.share.worldcat.org/idaas/scim/v2/Me', {
			status: 401,
			responseText: helper.error_response
		});
	  it('It should response the GET method', async() => {
	    	let response = await request(helper.app).get("/myaccount");
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200);
            expect($('div#content h1').text()).to.have.string("System Error");
			expect($('div#error_content > p#status').text()).to.have.string("Status - 401");
            expect($('div#error_content > p#message').text()).to.have.string("Message - Authentication failure. Missing or invalid authorization token.");
	    });
  });	
 
});
