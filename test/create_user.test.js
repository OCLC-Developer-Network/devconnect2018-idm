const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("#create_user", function(){ 
	beforeEach(() => {
		helper.moxios.install()
	})
	
	afterEach(() => {
		helper.moxios.uninstall()
	})

	it('It should response the GET method', async() => {
		let response = await request(helper.app).get("/create_user");
		let $ = cheerio.load(response.text);
		expect(response.statusCode).to.equal(200)
		expect($('div#content h1').text()).to.have.string("Create User");
	});	

	it('It should response the POST method with fields', async() => {
		helper.moxios.stubOnce('POST', 'https://128807.share.worldcat.org/idaas/scim/v2/Users', {
		    status: 200,
		    headers: {"ETag": "18983098"},
		    responseText: helper.create_user_response
		  });
		let response = await request(helper.app).post("/create_user").type("form").send({
			givenName: "Stacy", 
			familyName: "Smith (test)",
			email: "smiths@library.org",
			streetAddress: "1142 Jasmine Ridge Court",
			locality: "Bangor",
			region: "ME",
			postalCode: "04915"});
		let $ = cheerio.load(response.text);
	    expect(response.statusCode).to.equal(200)
	    expect($('div#content h1').text()).to.have.string("User Info");
	    expect($('p#name').text()).to.have.string("Name: Stacy Smith (test)");
	    expect($('p#email').text()).to.have.string("Email: smiths@library.org");
	    expect($('p#id').text()).to.have.string("ID/Namespace: 3ac7346f-3b61-4aa9-bcea-e0179f0a3c77 - urn:oclc:platform:128807");
	    expect($('p#institution').text()).to.have.string("Institution: 128807");
	});
});