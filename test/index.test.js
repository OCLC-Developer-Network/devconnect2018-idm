const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("routes", function(){
	beforeEach(() => {
		helper.moxios.install()
	})
	
	afterEach(() => {
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
      helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
          status: 200,
          responseText: helper.user_response
        });
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
  
  describe("#Error", function(){
	    it('It should response the GET method', async() => {
	        let response = await request(helper.app).get("/?error=invalid_client_id&error_description=WSKey+is+invalid&http_code=401&state=%2Fmyaccount");
	        let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200);
            expect($('div#content h1').text()).to.have.string("System Error");
			expect($('div#error_content > p#status').text()).to.have.string("Status - invalid_client_id");
            expect($('div#error_content > p#message').text()).to.have.string("Message - WSKey is invalid");
	    });
  });
  
  describe("#SCIM Error", function(){
      helper.moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
          status: 401,
          responseText: helper.error_response
        });	  
	    it('It should response the GET method', async() => {
	    	let response = await request(helper.app).get("/myaccount");
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200);
            expect($('div#content h1').text()).to.have.string("System Error");
			expect($('div#error_content > p#status').text()).to.have.string("Status - 401");
            //expect($('div#error_content > p#message').text()).to.have.string("Message - WSKey is invalid");
	    });
  });  
  
  describe.skip("#accessTokenError", function(){	  
	  helper.nock('https://authn.sd00.worldcat.org/oauth2')
      .post('/accessToken?grant_type=code&code=auth_12345&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http:%2F%2Flocalhost:8000%2Fmyaccount')
      .replyWithFile(401, __dirname + '/mocks/access_token_error.json', { 'Content-Type': 'application/json' });
	  //helper.app.set("accessToken", null);
	  
	  it('It should response the GET method', async() => {
	    	let response = await request(helper.app).get("/myaccount?code=auth_12345&state=%2Fmyaccount");
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200);
            expect($('div#content h1').text()).to.have.string("System Error");
			expect($('div#error_content > p#status').text()).to.have.string("Status - 401");
            expect($('div#error_content > p#message').text()).to.have.string("Message - WSKey is invalid");
	    });
  });
});
