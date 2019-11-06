const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("#update_user", function(){ 
	beforeEach(() => {
		helper.moxios.install()
	})
	
	afterEach(() => {
		helper.moxios.uninstall()
	})

	it('It should response the GET method', async() => {
		helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Users/1671151d-ac48-4b4d-a204-c858c3bf5d86', {
		    status: 200,
		    headers: {"ETag": "18983098"},
		    responseText: helper.single_user_response
		  });
		let response = await request(helper.app).get("/update_user/1671151d-ac48-4b4d-a204-c858c3bf5d86");
		let $ = cheerio.load(response.text);
		expect(response.statusCode).to.equal(200)
		expect($('div#content h1').text()).to.have.string("Update User");
	    expect($('input[name="givenName"]')).to.exist;
	    expect($('input[name="familyName"]')).to.exist;
	    expect($('input[name="email"]').val()).to.exist;
	    expect($('input[name="streetAddress"]')).to.exist;
	    expect($('input[name="locality"]')).to.exist;
	    expect($('input[name="region"]')).to.exist;
	    expect($('input[name="postalCode"]')).to.exist;
	});	

	it('It should response the POST method with fields', async() => {
		helper.moxios.stubOnce('PUT', 'https://128807.share.worldcat.org/idaas/scim/v2/Users/1671151d-ac48-4b4d-a204-c858c3bf5d86', {
		    status: 200,
		    headers: {"ETag": "18983098"},
		    responseText: helper.update_user_response
		  });
		let response = await request(helper.app).post("/update_user/1671151d-ac48-4b4d-a204-c858c3bf5d86").type("form").send({
			givenName: "Stacy", 
			familyName: "Smith (test)",
			email: "smiths@library.org",
			streetAddress: "1142 Jasmine Ridge Court",
			locality: "Bangor",
			region: "ME",
			postalCode: "04915"});
		let $ = cheerio.load(response.text);
	    expect(response.statusCode).to.equal(200)
	    expect($('div#content h1').text()).to.have.string("Update User");
	    expect($('input[name="givenName"]').val()).to.have.string("Stacy");
	    expect($('input[name="familyName"]').val()).to.have.string("Smith (test)");
	    expect($('input[name="email"]').val()).to.have.string("smiths@library.org");
	    expect($('input[name="streetAddress"]').val()).to.have.string("1142 Jasmine Ridge Court");
	    expect($('input[name="locality"]').val()).to.have.string("Bangor");
	    expect($('input[name="region"]').val()).to.have.string("ME");
	    expect($('input[name="postalCode"]').val()).to.have.string("04915");

	});
});