const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe.only("#user", function(){ 
	beforeEach(() => {
		helper.moxios.install()
	})
	
	afterEach(() => {
		helper.moxios.uninstall()
	})

	it('It should response the GET method', async() => {
		let response = await request(helper.app).get("/user");
		let $ = cheerio.load(response.text);
		expect(response.statusCode).to.equal(200)
		expect($('div#content h1').text()).to.have.string("Search by PPID");
	});	

	it('It should response the POST method with an ID', async() => {
		helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Users/1671151d-ac48-4b4d-a204-c858c3bf5d86', {
		    status: 200,
		    headers: {"ETag": "18983098"},
		    responseText: helper.single_user_response
		  });
		let response = await request(helper.app).post("/user").type("form").send({id: "1671151d-ac48-4b4d-a204-c858c3bf5d86", institution: "128807"});
		let $ = cheerio.load(response.text);
	    expect(response.statusCode).to.equal(200)
	    expect($('div#content h1').text()).to.have.string("User Info");
	    expect($('p#name').text()).to.have.string("Name: Karen Coombs");
	    expect($('p#email').text()).to.have.string("Email: coombsk@oclc.org");
	    expect($('p#id').text()).to.have.string("ID/Namespace: 1671151d-ac48-4b4d-a204-c858c3bf5d86 - urn:oclc:platform:128807");
	    expect($('p#institution').text()).to.have.string("Institution: 128807");
	});


	it('It should response the GET method with an ID', async() => {
		helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Users/1671151d-ac48-4b4d-a204-c858c3bf5d86', {
		    status: 200,
		    headers: {"ETag": "18983098"},
		    responseText: helper.single_user_response
		  });
    		let response = await request(helper.app).get("/user/1671151d-ac48-4b4d-a204-c858c3bf5d86");
    		let $ = cheerio.load(response.text);
        expect(response.statusCode).to.equal(200)
        expect($('div#content h1').text()).to.have.string("User Info");
        expect($('p#name').text()).to.have.string("Name: Karen Coombs");
        expect($('p#email').text()).to.have.string("Email: coombsk@oclc.org");
        expect($('p#id').text()).to.have.string("ID/Namespace: 1671151d-ac48-4b4d-a204-c858c3bf5d86 - urn:oclc:platform:128807");
        expect($('p#institution').text()).to.have.string("Institution: 128807");
    });
});