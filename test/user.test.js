const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const User = require('../src/User');
const user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/userResponse.json')).toString();
const single_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/readUserResponse.json')).toString();
const search_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/searchResponse.json')).toString();

describe('Create user test', () => {
	let my_user;
	  before(() => {
  			my_user = new User(JSON.parse(user_response));
		  });
	  
	  it('Creates an User object', () => {
		  expect(my_user).to.be.an.instanceof(User);
	  });
	  
	  it('Sets the User properties', () => {
		  expect(my_user.doc).to.be.an("object");
	  });
	  
	  it('Has functioning getters', () => {
        expect(my_user.getFamilyName()).to.equal('Coombs');
        expect(my_user.getGivenName()).to.equal('Karen');
        expect(my_user.getMiddleName()).to.equal('');
        expect(my_user.getEmail()).to.equal("coombsk@oclc.org");
        expect(my_user.getOclcPPID()).to.equal("412d947b-144e-4ea4-97f5-fd6593315f17");
        expect(my_user.getInstitutionId()).to.equal("128807");
        expect(my_user.getOclcNamespace()).to.equal("urn:oclc:platform:127950");
	  });
	  
	});

describe('Get self user tests', () => {
  beforeEach(() => {
	  moxios.install();
  });
  
  afterEach(() => {
	  moxios.uninstall();
  });

  it('Get user by Access Token', () => {
      moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
          status: 200,
          responseText: user_response
        });  
    return User.self(128807, 'tk_12345')
      .then(response => {
        //expect an user object back
    	expect(response).to.be.an.instanceof(User);

        expect(response.getFamilyName()).to.equal('Coombs');
        expect(response.getGivenName()).to.equal('Karen');
        expect(response.getMiddleName()).to.equal('');
        expect(response.getEmail()).to.equal("coombsk@oclc.org");
        expect(response.getOclcPPID()).to.equal("412d947b-144e-4ea4-97f5-fd6593315f17");
        expect(response.getInstitutionId()).to.equal("128807");
        expect(response.getOclcNamespace()).to.equal("urn:oclc:platform:127950");

      });
  });
});

describe('Find user tests', () => {
	  beforeEach(() => {
		  moxios.install();
	  });
	  
	  afterEach(() => {
		  moxios.uninstall();
	  });

	  it('Get user by Access Token', () => {
	      moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Users/1671151d-ac48-4b4d-a204-c858c3bf5d86', {
	          status: 200,
	          responseText: single_user_response
	        });  
	    return User.find("1671151d-ac48-4b4d-a204-c858c3bf5d86", 128807, 'tk_12345')
	      .then(response => {
	        //expect an user object back
	    	expect(response).to.be.an.instanceof(User);

	        expect(response.getFamilyName()).to.equal('Coombs');
	        expect(response.getGivenName()).to.equal('Karen');
	        expect(response.getMiddleName()).to.equal('');
	        expect(response.getEmail()).to.equal("coombsk@oclc.org");
	        expect(response.getOclcPPID()).to.equal("1671151d-ac48-4b4d-a204-c858c3bf5d86");
	        expect(response.getInstitutionId()).to.equal("128807");
	        expect(response.getOclcNamespace()).to.equal("urn:oclc:platform:128807");
	        expect(response.getExternalID()).to.equal("2200998");
	        expect(response.getUserName()).to.equal("NOT SUPPORTED");
	        expect(response.getEmails()).to.be.an("array");
	        expect(response.getAddresses()).to.be.an("array");
	        expect(response.getCircInfo().barcode).to.equal("2200998");
	        expect(response.getILLInfo().illId).to.equal("2200998");
	        expect(response.getCorrelationInfo()).to.be.an("array");
	        expect(response.getCorrelationInfo()[0].idAtSource).to.equal("069cc81f-395d-4272-86f2-99b54d8fbc29");

	      });
	  });
	});

describe.only('Search user tests', () => {
	  beforeEach(() => {
		  moxios.install();
	  });
	  
	  afterEach(() => {
		  moxios.uninstall();
	  });

	  it('Get user by Access Token', () => {
	      moxios.stubOnce('POST', 'https://128807.share.worldcat.org/idaas/scim/v2/Users/.search', {
	          status: 200,
	          responseText: search_user_response
	        });  
	    return User.search("External_ID", "2200998", 128807, 'tk_12345')
	      .then(response => {
	        //expect an user object back
	    	expect(response).to.be.an("array");
	    	expect(response[0]).to.be.an.instanceof(User);

	        expect(response[0].getFamilyName()).to.equal('Coombs');
	        expect(response[0].getGivenName()).to.equal('Karen');
	        expect(response[0].getMiddleName()).to.equal('');
	        expect(response[0].getEmail()).to.equal("coombsk@oclc.org");
	        expect(response[0].getOclcPPID()).to.equal("1671151d-ac48-4b4d-a204-c858c3bf5d86");
	        expect(response[0].getInstitutionId()).to.equal("128807");
	        expect(response[0].getOclcNamespace()).to.equal("urn:oclc:platform:128807");
	        expect(response[0].getExternalID()).to.equal("2200998");
	        expect(response[0].getUserName()).to.equal("NOT SUPPORTED");
	        expect(response[0].getEmails()).to.be.an("array");
	        expect(response[0].getAddresses()).to.be.an("array");
	        expect(response[0].getCircInfo().barcode).to.equal("2200998");
	        expect(response[0].getILLInfo().illId).to.equal("2200998");
	        expect(response[0].getCorrelationInfo()).to.be.an("array");
	        expect(response[0].getCorrelationInfo()[0].idAtSource).to.equal("069cc81f-395d-4272-86f2-99b54d8fbc29");

	      });
	  });
	});
