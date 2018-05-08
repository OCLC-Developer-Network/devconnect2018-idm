const axios = require("axios");

const serviceUrl = '.share.worldcat.org/idaas/scim/v2';

const UserError = require('../src/UserError');

module.exports = class User {
    constructor(doc) {
	    this.doc = doc;
    }
    
    getFamilyName() {
    	return this.doc.name.familyName;
    }
    
    getGivenName() {
    	return this.doc.name.givenName;
    }
    
    getMiddleName() {
    	return this.doc.name.middleName;
    }
    
    getEmail() {
    	return this.doc.email;
    }
    
    getOclcPPID() {
    	return this.doc.oclcPPID;
    }
    
    getInstitutionId() {
    	return this.doc.institutionId;
    }
    
    getOclcNamespace() {
    	return this.doc.oclcNamespace;
    }	

    static find(id, institution, accessToken) {
    	var config = {
    			  headers: {
    				  'Authorization': 'Bearer ' + accessToken,
    				  'User-Agent': 'node.js KAC client'
    			  }
    			};
    	
    	let url = 'https://' + institution + serviceUrl + '/Users/' + id;
        return new Promise(function (resolve, reject) {
            axios.get(url, config)
          		.then(response => {
          			// parse out the User
        			resolve(new User(response.data));	    	
          	    })
          		.catch (error => {
          			reject(new UserError(error));
          		});
        });
    }
    
    static self(institution, accessToken) {
    	var config = {
    			  headers: {
    				  'Authorization': 'Bearer ' + accessToken,
    				  'User-Agent': 'node.js KAC client'
    			  }
    			};
    	
    	let url = 'https://' + institution + serviceUrl + '/Me';
        return new Promise(function (resolve, reject) {
            axios.get(url, config)
          		.then(response => {
          			// parse out the User
        			resolve(new User(response.data));	    	
          	    })
          		.catch (error => {
          			reject(new UserError(error));
          		});
        });
    }
};
