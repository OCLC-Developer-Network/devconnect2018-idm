const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const User = require('../src/User');
const user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/userResponse.json')).toString();

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
