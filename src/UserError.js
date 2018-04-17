module.exports = class UserError {
    constructor(error) {
    	this.error = error;
        if (this.error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
        	this.code = this.error.response.status;
        	this.request = this.error.request;
        	this.doc = this.error.response.data;

        	if (this.doc.message) {
        		this.message = this.doc.message;
        		this.detail = this.doc.detail;
        	} else {
        		this.message = this.doc.detail;
        		this.detail = null;
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