const axios = require("axios");

const serviceUrl = '.share.worldcat.org/idaas/scim/v2';

const UserError = require('../src/UserError');

module.exports = class User {
    constructor(doc, eTag = null) {
	    this.doc = doc;
	    if (eTag){
	    	this.eTag = eTag;
	    }
    }
    
    getETag(){
    	return this.eTag;
    }
    
    getID(){
    	return this.doc.id;
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
    	if (this.doc.email){
    		let email =  this.doc.email;
    		return email;
    	} else if (this.getEmails().length === 1) {
    		let email = this.getEmails()[0].value;
    		return email;
    	} 
    }
    
    getOclcPPID() {
    	if (this.doc.oclcPPID) {
    		return this.doc.oclcPPID;
    	} else {
    		return this.doc['urn:mace:oclc.org:eidm:schema:persona:persona:20180305'].oclcPPID;
    	}
    }
    
    getInstitutionId() {
    	if (this.doc.institutionId) {
    		return this.doc.institutionId;
    	} else {
    		return this.doc['urn:mace:oclc.org:eidm:schema:persona:persona:20180305'].institutionId;
    	}
    }
    
    getOclcNamespace() {
    	if (this.doc.oclcNamespace) {
    		return this.doc.oclcNamespace;
    	} else {
    		return this.doc['urn:mace:oclc.org:eidm:schema:persona:persona:20180305'].oclcNamespace;
    	}
    	
    }	
    
    getExternalID() {
    	return this.doc.externalId;
    }
    
    getUserName(){
    	return this.doc.userName;
    }
    
    getEmails(){
    	return this.doc.emails;
    }
    
    getAddresses(){
    	return this.doc.addresses;
    }
    
    getCircInfo(){
    	return this.doc["urn:mace:oclc.org:eidm:schema:persona:wmscircpatroninfo:20180101"].circulationInfo;
    }
    
    getILLInfo(){
    	return this.doc["urn:mace:oclc.org:eidm:schema:persona:wsillinfo:20180101"].illInfo;
    }
    
    getCorrelationInfo(){
    	return this.doc["urn:mace:oclc.org:eidm:schema:persona:correlationinfo:20180101"].correlationInfo;
    }

    static find(id, institution, accessToken) {
    	let config = {
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
        			resolve(new User(response.data, response.headers['etag']));	    	
          	    })
          		.catch (error => {
          			reject(new UserError(error));
          		});
        });
    }
    
    static add(fields, institution, accessToken) {
    	let config = {
  			  headers: {
  				  'Authorization': 'Bearer ' + accessToken,
  				  'User-Agent': 'node.js KAC client',
  				  'Content-Type': 'application/scim+json'
  			  }
  			};
  	
    	let url = 'https://' + institution + serviceUrl + '/Users';
		return new Promise(function (resolve, reject) {
			  let data = {
			  "schemas": [
				    "urn:ietf:params:scim:schemas:core:2.0:User",
				    "urn:mace:oclc.org:eidm:schema:persona:correlationinfo:20180101",
				    "urn:mace:oclc.org:eidm:schema:persona:persona:20180305",
				    "urn:mace:oclc.org:eidm:schema:persona:wmscircpatroninfo:20180101",
				    "urn:mace:oclc.org:eidm:schema:persona:wsillinfo:20180101"
				  ],
				  "name": {
				    "familyName": fields['familyName'],
				    "givenName": fields['givenName'],
				    "middleName": fields['middleName'],
				    "honorificPrefix": fields['honorificPrefix'],
				    "honorificSuffix": fields['honorificSuffix']
				  },
				  "emails": [
					    {
					      "value": fields['email'],
					      "type": "home",
					      "primary": true
					    }
					  ],
				  "addresses": [
				    {
				      "streetAddress": fields['streetAddress'],
				      "locality": fields['locality'],
				      "region": fields['region'],
				      "postalCode": fields['postalCode'],
				      "type": "home",
				      "primary": false
				    }
				  ],
				  "urn:mace:oclc.org:eidm:schema:persona:wmscircpatroninfo:20180101": {
					    "circulationInfo": {
					      "barcode": fields['barcode'],
					      "borrowerCategory": fields['borrowerCategory'],
					      "homeBranch": fields['homeBranch']
					    }				  
				},
				"urn:mace:oclc.org:eidm:schema:persona:persona:20180305": {
				    "institutionId": institution
				}
			  };
			  
			  if (fields['sourceSystem'] && fields['idAtSource']) {
				  let correlationInfo = 
							      {
							        "sourceSystem": fields['sourceSystem'],
							        "idAtSource": fields['idAtSource']
							      };
				  data["urn:mace:oclc.org:eidm:schema:persona:correlationinfo:20180101"]= {};
				  data["urn:mace:oclc.org:eidm:schema:persona:correlationinfo:20180101"]["correlationInfo"] = [JSON.stringify(correlationInfo)];
			  }
			  
		      axios.post(url, data, config)
		    		.then(response => {
		    			resolve(new User(response.data, response.headers['etag']));	    	
		    	    })
		    		.catch (error => {
		    			reject(new UserError(error));
		    		});
		});
    }
    
    static update(user, institution, accessToken){
    	let config = {
  			  headers: {
  				  'Authorization': 'Bearer ' + accessToken,
  				  'User-Agent': 'node.js KAC client',
  				  'Content-Type': 'application/scim+json',
  				  'If-Match': user.getETag()
  			  }
  			};
  	
	  	let url = 'https://' + institution + serviceUrl + '/Users/' + user.getID();
	      return new Promise(function (resolve, reject) {
	          axios.put(url, JSON.stringify(user.doc), config)
	        		.then(response => {
	        			// parse out the User
	      			resolve(new User(response.data, response.headers['etag']));	    	
	        	    })
	        		.catch (error => {
	        			reject(new UserError(error));
	        		});
	      });
    }
    
    static self(institution, accessToken) {
    	let config = {
    			  headers: {
    				  'Authorization': 'Bearer ' + accessToken,
    				  'User-Agent': 'node.js KAC client'
    			  }
    			};
    	
    	let url = 'https://' + institution + serviceUrl + '/Me';
        return new Promise(function (resolve, reject) {
            axios.get(url, config)
          		.then(response => {
        			resolve(new User(response.data, response.headers['etag']));	    	
          	    })
          		.catch (error => {
          			reject(new UserError(error));
          		});
        });
    }
    
    static search(index, term, institution, accessToken) {
    	let config = {
    			  headers: {
    				  'Authorization': 'Bearer ' + accessToken,
    				  'User-Agent': 'node.js KAC client',
    				  'Content-Type': 'application/scim+json',
    			  }
    			};
    	let filter = index + " eq " + term
    	let data = {
    		     "schemas": ["urn:ietf:params:scim:api:messages:2.0:SearchRequest"],
    		     "filter": filter
    		   }    	
    	let url = 'https://' + institution + serviceUrl + '/Users/.search';
        return new Promise(function (resolve, reject) {
            axios.post(url, data, config)
          		.then(response => {
          			let results = [];
          			response.data.Resources.forEach(function (result){
          				results.push(new User(result));
          			});
        			resolve(results);	    	
          	    })
          		.catch (error => {
          			reject(new UserError(error));
          		});
        });
    }    
};
