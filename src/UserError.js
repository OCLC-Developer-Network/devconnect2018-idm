module.exports = class UserError {
    constructor(error) {
    	this.error = error;
        if (this.error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
        	if (this.error.response.status) {
        		this.code = this.error.response.status;
        	} else {
        		this.code = this.error.response.statusCode;
        	}
        	
        	this.request = this.error.request;
        	if (this.error.response.data){
        		if (typeof this.error.response.data === 'string') {
        			this.doc = JSON.parse(this.error.response.data);
	        	} else {
	        		this.doc = this.error.response.data;
	        	}
        		if (this.doc.message){
        			this.message = this.doc.message;
        			this.detail = this.doc.details;
        		} else {
        			this.message = this.doc.detail;
        			this.detail = null;
        		}
        	} else {
        		if (typeof this.error.response.body === 'string') {
        			this.doc = JSON.parse(this.error.response.body);
	        	} else {
	        		this.doc = this.error.response.body;
	        	}
        		this.message = this.doc.message;
        		if (this.doc.detail) {
        			this.detail = this.doc.detail;
        		} else {
        			this.detail = this.doc.details;
        		}
        	}
          } else if (this.error.request) {
            // The request was made but no response was received
            this.request = this.error.request;
            
            this.code = null;
            this.message = null;
            this.detail = null;
          } else {
            // Something happened in setting up the request that triggered an Error
        	this.code = null;  
            this.message = this.error.message;
            this.detail = null;
          }
    }
	getRequestError(){
		return this.error;
	}
	
	getCode(){
		return this.code;
	}
	
	getMessage(){
		return this.message;
	}
	
	getDetail(){
		return this.detail;
	}

};