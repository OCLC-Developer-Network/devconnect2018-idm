const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const User = require('../src/User');
const user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/userResponse.json')).toString();
const single_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/readUserResponse.json')).toString();
const search_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/searchResponse.json')).toString();
const create_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/createUserResponse.json')).toString();
const update_user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/updateUserResponse.json')).toString();

describe('Create user test', () => {
	let my_user;
	  before(() => {
  			my_user = new User(JSON.parse(single_user_response));
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
        expect(my_user.getOclcPPID()).to.equal("1671151d-ac48-4b4d-a204-c858c3bf5d86");
        expect(my_user.getInstitutionId()).to.equal("128807");
        expect(my_user.getOclcNamespace()).to.equal("urn:oclc:platform:128807");
        expect(my_user.getEmails().length).to.equal(1);
	  });
	  
	  it('Has functioning setters', () => {
		my_user.setFamilyName("Smith")
        expect(my_user.getFamilyName()).to.equal('Smith');
		my_user.setGivenName("Liam")
        expect(my_user.getGivenName()).to.equal('Liam');
		my_user.setMiddleName("Declan")
        expect(my_user.getMiddleName()).to.equal('Declan');

		my_user.addEmail("smithl@oclc.org", "home", true)
		expect(my_user.getEmails()).to.be.an("array");
		expect(my_user.getEmails()[1].value).to.equal("smithl@oclc.org")
		expect(my_user.getEmail()).to.equal("smithl@oclc.org");
		
		my_user.setEmail(0, {"email": "", "type": "office", "primary": false});
        
		my_user.addAddress("1142 Jasmine Ridge Court", "Bangor", "ME","04915");
		expect(my_user.getAddresses()).to.be.an("array");
		
		my_user.setAddress(0, {'postalCode': "04849"});
		
		expect(my_user.getAddresses()[0].postalCode).to.equal("04849")
        
	  });
	  
	});

describe('Get self user tests', () => {
  beforeEach(() => {
	  moxios.install();
  });
  
  afterEach(() => {
	  moxios.uninstall();
  });

  it('Get self by Access Token', () => {
      moxios.stubOnce('GET', 'https://128807.share.worldcat.org/idaas/scim/v2/Me', {
          status: 200,
          headers: {"ETag": "18983098"},
          responseText: user_response
        });
      
    return User.self(128807, 'tk_12345')
      .then(response => {
        //expect an user object back
    	  	expect(response).to.be.an.instanceof(User);
    	  	expect(response.getETag()).to.equal("18983098")
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
	          headers: {"ETag": "18983098"},
	          responseText: single_user_response
	        });  
	    return User.find("1671151d-ac48-4b4d-a204-c858c3bf5d86", 128807, 'tk_12345')
	      .then(response => {
	        //expect an user object back
	    	expect(response).to.be.an.instanceof(User);

	    	expect(response.getETag()).to.equal("18983098")
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

describe('Add user tests', () => {
	  beforeEach(() => {
		  moxios.install();
	  });
	  
	  afterEach(() => {
		  moxios.uninstall();
	  });

	  it('Add user by Access Token', () => {
	      moxios.stubOnce('POST', 'https://128807.share.worldcat.org/idaas/scim/v2/Users', {
	          status: 200,
	          headers: {"ETag": "18983098"},
	          responseText: create_user_response
	        });  
	    let fields = {
	    		"familyName": "Smith (test)",
	    		"givenName": "Stacy",
	    		"email": "smiths@library.org",
	    		"streetAddress": "1142 Jasmine Ridge Court",
	    		"locality": "Bangor",
	    		"region": "ME",
	    		"postalCode": "04915",
	    		"barcode": "330912",
	    		"borrowerCategory": "ADULT",
	    		"homeBranch": "129479",
	    		"sourceSystem": "urn:mytest:sourceSystem",
	    		"idAtSource": "smiths12"
	    		};
	    
	    return User.add(fields, 128807, 'tk_12345')
	      .then(response => {
	        //expect an user object back
	    	expect(response).to.be.an.instanceof(User);

	        expect(response.getFamilyName()).to.equal('Smith (test)');
	        expect(response.getGivenName()).to.equal('Stacy');
	        expect(response.getEmail()).to.equal("smiths@library.org");
	        expect(response.getOclcPPID()).to.equal("3ac7346f-3b61-4aa9-bcea-e0179f0a3c77");
	        expect(response.getInstitutionId()).to.equal("128807");
	        expect(response.getOclcNamespace()).to.equal("urn:oclc:platform:128807");
	        expect(response.getExternalID()).to.equal("330912");
	        expect(response.getUserName()).to.equal("NOT SUPPORTED");
	        expect(response.getEmails()).to.be.an("array");
	        expect(response.getAddresses()).to.be.an("array");
	        expect(response.getCircInfo().barcode).to.equal("330912");
	        expect(response.getCorrelationInfo()).to.be.an("array");
	        expect(response.getCorrelationInfo()[0].idAtSource).to.equal("smiths12");

	      });
	  });
	});

describe('Update user tests', () => {
	  beforeEach(() => {
		  moxios.install();
	  });
	  
	  afterEach(() => {
		  moxios.uninstall();
	  });

	  it('Updates user by Access Token', () => {
	      moxios.stubOnce('PUT', 'https://128807.share.worldcat.org/idaas/scim/v2/Users/3ac7346f-3b61-4aa9-bcea-e0179f0a3c77', {
	          status: 200,
	          headers: {"ETag": "18983098"},
	          responseText: update_user_response
	        });  
	    
	    let user = new User(JSON.parse(create_user_response));
	    user.doc.name.middleName = "Anne"
	    
	    return User.update(user, 128807, 'tk_12345')
	      .then(response => {
	        //expect an user object back
	    	expect(response).to.be.an.instanceof(User);

	        expect(response.getFamilyName()).to.equal('Smith (test)');
	        expect(response.getMiddleName()).to.equal('Anne');
	        expect(response.getGivenName()).to.equal('Stacy');
	        expect(response.getEmail()).to.equal("smiths@library.org");
	        expect(response.getOclcPPID()).to.equal("3ac7346f-3b61-4aa9-bcea-e0179f0a3c77");
	        expect(response.getInstitutionId()).to.equal("128807");
	        expect(response.getOclcNamespace()).to.equal("urn:oclc:platform:128807");
	        expect(response.getExternalID()).to.equal("330912");
	        expect(response.getUserName()).to.equal("NOT SUPPORTED");
	        expect(response.getEmails()).to.be.an("array");
	        expect(response.getAddresses()).to.be.an("array");
	        expect(response.getCircInfo().barcode).to.equal("330912");
	        expect(response.getCorrelationInfo()).to.be.an("array");
	        expect(response.getCorrelationInfo()[0].idAtSource).to.equal("smiths12");

	      });
	  });
	});

describe('Search user tests', () => {
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
