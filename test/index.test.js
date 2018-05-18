const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
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
});
