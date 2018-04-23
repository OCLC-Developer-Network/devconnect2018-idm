# Get your early access pass to the new WorldShare Identity Management API
## OCLC DEVCONNECT 2018
### Tutorial Part 5 - Creating Models Using Test Driven Development

#### Test Setup
1. Open package.json
2. Add line to scripts section to run tests
```
    "test": "mocha"
```

3. Create a directory within `tests` called `mocks`
    1. Add the following files to `mocks` containing the linked code
        1. [userResponse](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-idm/master/tests/mocks/userResponse.json)
        2. [errorMock](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-idm/master/tests/mocks/errorMock.js)
        3. [errorResponse](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-idm/master/tests/mocks/errorResponse.json)
        4. [AccessTokenMock.js](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-idm/master/tests/mocks/AccessTokenMock.js)
        5. [AccessTokenMock.js](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-idm/master/tests/mocks/accessTokenErrorMock.js)
        6. [access_token_response](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-idm/master/tests/mocks/access_token.json)

#### Write your first test

1. In tests directory create a file named user.test.js to test your User Class 
2. Open user.test.js and add constants for classes you want to use (WSKey and Access Token)
```
const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const User = require('../src/User');
const user_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/userResponse.json')).toString();

``` 

3. Write for Test creating a Bib
    1. Create a new User object
        a. load API response
        b. parse out MARC record
        c. create a new Bib from MARC
    2. Test that it is an instance of a Bib object
    
```
describe('Create user test', () => {
    let my_user;
      before(() => {
            my_user = new User(JSON.parse(user_response));
          });
      
      it('Creates an User object', () => {
          expect(my_user).to.be.an.instanceof(User);
      });
});      
```

4. Make the test pass by creating User class and constructor
    1. In the src directory create a file named User.js to represent the User Class
    2. Open User.js, declare User class and add use constants for classes you want to use
    ```
    const axios = require("axios");

    const serviceUrl = '.share.worldcat.org/idaas/scim/v2';

    const UserError = require('../src/UserError');
    
    module.exports = class User {
    ```
     
    3. Create a constructor for the User class
    ```
    constructor(doc) {
        this.doc = doc;
    }
    ```   
5. Run tests
```bash
npm test
```

6. Write a test for making sure a doc property is set
    1. Make sure "Creates an User object" passes
    2. Test that it is an instance of a JSON object
```
      it('Sets the User properties', () => {
          expect(my_user.doc).to.be.an.instanceof(object);
      });
```

7. Run tests
```bash
npm test
```

#### Getters
1. Write a test to ensure "getter" functions are returning values
    1. Make sure "Sets the User properties" passes
    2. Test each "getter" method returns appropriate value.
```
      it('Has functioning getters', () => {
        expect(my_user.getFamilyName()).to.equal('Coombs');
        expect(my_user.getGivenName()).to.equal('Karen');
        expect(my_user.getMiddleName()).to.equal('');
        expect(my_user.getEmail()).to.equal("coombsk@oclc.org");
        expect(my_user.getOclcPPID()).to.equal("412d947b-144e-4ea4-97f5-fd6593315f17");
        expect(my_user.getInstitutionId()).to.equal("128807");
        expect(my_user.getOclcNamespace()).to.equal("urn:oclc:platform:127950");
      });
```
2. Write function to get the FamilyName in User class
    ```
        getFamilyName() {
            return this.doc.name.familyName;
        }
    ```

3. Run tests
```bash
npm test
```

4. Write function to get a GivenName in User class

    ```
        getGivenName() {
            return this.doc.name.givenName;
        }
    ```

5. Run tests
```bash
npm test
```

6. Write function to get the MiddleName in the User class
```    
    getMiddleName() {
        return this.doc.name.middleName;
    }
```

7. Run tests
```bash
npm test
```

8. Write function to get the Email in User class
```
    getEmail() {
        return this.doc.email;
    }
```
9. Run tests
```bash
npm test
```

10. Write function to get the OclcPPID in the User Class

```
    getOclcPPID() {
        return this.doc.oclcPPID;
    }
```

11. Run tests
```bash
npm test
```

12. Write function to get the InstitutionId in the User Class

```
    getInstitutionId() {
        return this.doc.institutionId;
    }
```

13. Run tests
```bash
npm test
```

14. Write function to get the OclcNamespace in the User Class

```
    getOclcNamespace() {
        return this.doc.oclcNamespace;
    }
```

15. Run tests
```bash
npm test
```

#### Getting a User from the API
1. Tell tests what file to use for mocks

```
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
        // Test expects go here
  });
});        
```        

2. Get Self
3. Test that object returned is an instance of a User
```
    return User.self(128807, 'tk_12345')
      .then(response => {
        //expect an user object back
        expect(response).to.be.an.instanceof(User);

      });
```

5. Make test pass by creating a static "self" function for the User
    1. Make function take to variables
        1. institution
        2. access token 
    2. Create a url for the request
    3. Create an HTTP client
    4. Create a set of headers
    5. try to make the HTTP request
        1. If successful
            1. Pass response to create a new User
        2. If fails
            1. Pass response off to UserError to handle
```    
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
```

9. Run tests
```bash
npm test
```
    
#### Write test for getting data from User
1. Test that getFamilyName method returns a value of Coombs 
2. Test that getGivenName method returns a value of Karen
3. Test that getMiddleName method returns a value of ""
4. Test that getEmail method returns a value of coombsk@oclc.org
5. Test that getOclcPPID method returns a value of 412d947b-144e-4ea4-97f5-fd6593315f17
6. Test that getInstitutionId method returns a value of 128807
7. Test that getOclcNamespace method returns a value of urn:oclc:platform:127950

```        
    expect(response.getFamilyName()).to.equal('Coombs');
    expect(response.getGivenName()).to.equal('Karen');
    expect(response.getMiddleName()).to.equal('');
    expect(response.getEmail()).to.equal("coombsk@oclc.org");
    expect(response.getOclcPPID()).to.equal("412d947b-144e-4ea4-97f5-fd6593315f17");
    expect(response.getInstitutionId()).to.equal("128807");
    expect(response.getOclcNamespace()).to.equal("urn:oclc:platform:127950");
```

6. Run tests
```bash
npm test
```       

#### Write the first test for the UserError Class
1. In tests directory create a file named user_error.test.js to test your UserError Class 
2. Open user_error.test.js and add constants for classes you want to use (WSKey and Access Token)

```
const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const UserError = require('../src/UserError');
const error_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/errorResponse.json')).toString();
const User = require('../src/User');

const error_mock = require('./mocks/errorMock');
```
 
3. Write for Test creating a UserError
    1. Create a new UserError object
    2. Test that it is an instance of a UserError object

```
describe('Create Error test', () => {
    var error;
      before(() => {
            error = new UserError(error_mock);
          });
      
      it('Creates an Error object', () => {
          expect(error).to.be.an.instanceof(UserError);
      });
});      
```

6. Make the test pass by creating UserError class and constructor
    1. In the src directory create a file named UserError.js to represent the UserError Class
    2. Open UserError.js and declare UserError class
    ```

    module.exports = class UserError {
    }
    
    ```
    
    3. Create a constructor for the UserError class
    ```
    constructor(error) {
        this.error = error;
        if (this.error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.code = this.error.response.status;
            this.request = this.error.request;
            this.doc = this.error.response.data;

            this.message = this.doc.detail;
          } else if (this.error.request) {
            // The request was made but no response was received
            this.request = this.error.request;
          } else {
            // Something happened in setting up the request that triggered an Error
            this.message = this.error.message;
          }   
    }
    ```   
    
7. Run tests
```bash
npm test
```

#### Properties set
1. Write code to ensure error properties are set
```
      it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)
        expect(error.message).to.equal('Authentication failure. Missing or invalid authorization token.')
      });
```

2. Run tests
```bash
npm test
```   

#### Getters
1. Write a test to ensure "getter" functions are returning values
```
      it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
      });
```

2. Write code for getting a request error
```
    getRequestError()
    {
        return this.requestError;
    }
```

3. Run tests
```bash
npm test
``` 

4. Create function to retrieve error code
    ```
    getCode(){
        return this.code;
    }
    ```
5. Run tests
```bash
npm test
```       

6. Create function to retrieve error message
    ```
    getMessage(){
        return this.message
    }
    ```
7. Run tests
```bash
npm test
```

### Test that Access Token error can be properly parsed
1. Add mock for Access token error
```
const accesstoken_error_mock = require('./mocks/accessTokenErrorMock')
```

2. Pass the UserError class the Access Token error mock
3. Check the object is instantiated
4. Test the properties are set
5. Test the getters work

```
describe('Create Error from Access Token Error test', () => {
    var error;
      before(() => {
            error = new UserError(accesstoken_error_mock);
          });
      
      it('Creates an Error object', () => {
          expect(error).to.be.an.instanceof(UserError);
      });
      
      it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)
        expect(error.message).to.equal('Authentication failure. Missing or invalid authorization token.')
      });
      
      it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
      });
      
    });             
```

#### Alter UserError Class to handle Access Token errors
1. Change UserError Class constructor
```
this.code = this.error.response.status;
this.request = this.error.request;
this.doc = this.error.response.data;

this.message = this.doc.detail;
```

to

```
if (this.error.response.status) {
    this.code = this.error.response.status;
} else {
    this.code = this.error.response.statusCode;
}

this.request = this.error.request;
if (this.error.response.data){
    this.doc = this.error.response.data;
    this.message = this.doc.detail;
    this.detail = null;
} else {
    this.doc = JSON.parse(this.error.response.body);
    this.message = this.doc.message;
    this.detail = this.doc.detail;
}
```
            
2. Run tests
```bash
npm test
```

#### Test that an API error can be properly parsed
1. Create tests for parsing API errors
    1. Tell tests what file to use for mocks
    2. Call User::self in a failed fashion
    3. Test error is an instance of UserError
    4. Test the getCode() method returns 401
    5. Test the getMessage() method returns Authentication failure. Missing or invalid authorization token.

```
describe('API Error tests', () => {
  beforeEach(() => {
      moxios.install();
  });
  
  afterEach(() => {
      moxios.uninstall();
  });

  it('Returns a 401 Error from an HTTP request', () => {
      moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
          status: 401,
          responseText: error_response
      });
      
    return User.self(128807, 'tk_12345')
      .catch(error => {
        //expect an Error object back
        expect(error).to.be.an.instanceof(UserError);
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401);
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
        
      });
  });
```

2. Run tests
```bash
npm test
```    

**[on to Part 6](tutorial-06.md)**

**[back to Part 4](tutorial-04.md)**