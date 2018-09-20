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
    
    setFamilyName(familyName){
    		this.doc.name.familyName = familyName;
    }
    
    getGivenName() {
    		return this.doc.name.givenName;
    }
    
    setGivenName(givenName){
    		this.doc.name.givenName = givenName;
    }
    
    getMiddleName() {
    		return this.doc.name.middleName;
    }
    
    setMiddleName(middleName){
    		this.doc.name.middleName = middleName;
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
    
    setEmail(email){
    		this.getEmails()[0].value = email;
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
    
    addAddress(streetAddress, locality, region, postalCode, type, primary = false){
		let newAddress = {
				"streetAddress": streetAddress, 
				"locality": locality, 
				"region": region,
				"postalCode": postalCode,
				"type": type,
				"primary": primary
			}
    		this.doc.addresses.push(newAddress);
    }
    
    setAddress(number, fields){
    		if (fields['streetAddress']){
    			this.doc.addresses[number].streetAddress = fields['streetAddress'];
    		}
    		if (fields['locality']) {
    			this.doc.addresses[number].locality = fields['locality'];
    		}
    		if (fields['region']){
    			this.doc.addresses[number].region = fields['region'];
    		}
    		if (fields['postalCode']) {
    			this.doc.addresses[number].postalCode = fields['postalCode'];
    		}
    		
    		if (fields['type']) {
    			this.doc.addresses[number].type = fields['type'];
    		}
    		
    		if (fields['primary']) {
    			this.doc.addresses[number].primary = fields['primary'];
    		}
    }
    
    setPassword(password){
    		this.doc["urn:mace:oclc.org:eidm:schema:persona:persona:20180305"].oclcPassword = password;
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
    	let filter = index + ' eq "' + term + '"'
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
          			console.log(error.response.data)
          			reject(new UserError(error));
          		});
        });
    }    
};
