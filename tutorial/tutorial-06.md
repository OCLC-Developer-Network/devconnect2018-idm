# Get your early access pass to the new WorldShare Identity Management API
## OCLC DEVCONNECT 2018
### Tutorial Part 6 - Framework fundementals

#### Configuration
1. In project root create file prod_config.yml
2. Edit prod_config.yml so it contains a set of key value pairs with:
    - wskey key
    - wskey secret
    - principalID
    - principalIDNS
    - institution registry ID
	
```
wskey: test
secret: secret
principalID: id 
principalIDNS: namespace
institution: 128807
```

#### Creating the Application Entry point
1. Create a file called server.js
2. Open server.js
3. Load dependencies
```
"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const Wskey = require("nodeauth/src/wskey");
const User = require("nodeauth/src/user");

const User = require("./user.js")
const UserError = require("./UserError.js")

```

4. Configure the application
    1. use ejs to render html templates
    2. set directory where views are stored to views
    
```
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views'); 
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

module.exports = app;
```

#### Create code to load configuration information
1. In src folder create a file called config.js
2. Open config.js
    1. Create a function that loads the configuration data file as a string based on the environment
    
    ```
    "use strict";
    const fs = require('fs');

    module.exports = function get_config(environment) {
        return yaml.load(fs.readFileSync(require('path').resolve(__dirname, '../' + environment + '_config.yml')).toString());
    };        
    ```

#### Create local configuration for running application
1. In project root create a file called local.js
2. Open local.js
    1. Require yaml parsing library 
    2. Require src/config.js
    3. Set the environment
    4. Load the configuration 
    5. Require src/server.js
    3. Tell application what port to run on
    4. Log what application is doing

```
const yaml = require('js-yaml');
const get_config = require("./src/config.js");
let environment = 'prod';
global.config = yaml.load(get_config(environment));
let app = require('./src/server.js');
let port = process.env.PORT || 8000;

// Server
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});
        
```

#### Add script for starting app to package.json
1. Open package.json
2. In scripts section add

```
"start": "nodemon local.js",
```

#### Application Authentication
Authentication happens repeatedly in our application so we want to create a reusable function to handle Authentication when we need it. To do this we're using something called a "Middleware".
The idea behind middleware is to allow us to intercept any request and tell the application to do something before and/or application request. 
In this case we're the application that anytime this function is called it should perform authentication BEFORE the client request.

1. Open server.js
2. Add authentication setup
    1. instantiate user and wskey objects
    2. create access token variable
    

```

const options = {
        services: ["SCIM:read_self", "refresh_token"],
        redirectUri: "http://localhost:8000/loggedIn"
    };

const wskey = new Wskey(config['wskey'], config['secret'], options);

this.accessToken = null;
```

3. Create a function that retrieve an Access token
    1. Check for an existing valid Access Token
        - if present go on your way
    2. Check for valid Refresh Token 
        - if present, use it to get a valid Access Token
    3. Check for Authorization code 
        1. if present, use it to get a valid Access Token
    4. If none of the above, redirect the user login     
    
```   

```

4. Add application level middleware which performs authentication everywhere using getAccessToken function.

```
app.use(function (req, res, next) {
    getAccessToken(req, res, next);
});
```


**[on to Part 7](tutorial-07.md)**

**[back to Part 5](tutorial-05.md)**