const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("#search", function(){ 
	beforeEach(() => {
		helper.moxios.install()
	})
	
	afterEach(() => {
		helper.moxios.uninstall()
	})

	it('It should response the GET method', async() => {
		let response = await request(helper.app).get("/search");
		let $ = cheerio.load(response.text);
		expect(response.statusCode).to.equal(200)
		expect($('div#content h1').text()).to.have.string("Search by External ID");
	});	

	it('It should response the POST method with an ID', async() => {
		helper.moxios.stubOnce('POST', 'https://128807.share.worldcat.org/idaas/scim/v2/Users/.search', {
		    status: 200,
		    responseText: helper.search_user_response
		  });
		let response = await request(helper.app).post("/search").type("form").send({query: "2200998", institution: "128807"});
		let $ = cheerio.load(response.text);
	    expect(response.statusCode).to.equal(200)
	    expect($('div#content h1').text()).to.have.string("User Info");
	    expect($('p#name').text()).to.have.string("Name: Karen Coombs");
	    expect($('p#email').text()).to.have.string("Email: coombsk@oclc.org");
	    expect($('p#id').text()).to.have.string("ID/Namespace: 1671151d-ac48-4b4d-a204-c858c3bf5d86 - urn:oclc:platform:128807");
	    expect($('p#institution').text()).to.have.string("Institution: 128807");
	});
});