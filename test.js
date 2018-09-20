const fs = require('fs');
const yaml = require('js-yaml');
const get_config = require("./src/config.js");
const moxios = require('moxios');
const accessToken = require('./test/mocks/AccessTokenMock');
const user_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/userResponse.json')).toString();
const error_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/errorResponse.json')).toString();
const single_user_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/readUserResponse.json')).toString();
const search_user_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/searchResponse.json')).toString();
const create_user_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/createUserResponse.json')).toString();
const update_user_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/updateUserResponse.json')).toString();

moxios.install();

moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Me', {
    status: 200,
    headers: {"ETag": "18983098"},
    responseText: user_response
  });

moxios.stubRequest('https://128807.share.worldcat.org/idaas/scim/v2/Users/1671151d-ac48-4b4d-a204-c858c3bf5d86', {
    status: 200,
    headers: {"ETag": "18983098"},
    responseText: single_user_response
  });

moxios.stubOnce('POST', 'https://128807.share.worldcat.org/idaas/scim/v2/Users', {
    status: 200,
    headers: {"ETag": "18983098"},
    responseText: create_user_response
  });

moxios.stubOnce('PUT', 'https://128807.share.worldcat.org/idaas/scim/v2/Users/3ac7346f-3b61-4aa9-bcea-e0179f0a3c77', {
    status: 200,
    headers: {"ETag": "18983098"},
    responseText: update_user_response
  });

moxios.stubOnce('POST', 'https://128807.share.worldcat.org/idaas/scim/v2/Users/.search', {
    status: 200,
    responseText: search_user_response
  });

let environment = "test";

global.config = "";

global.config = yaml.load(get_config(environment));
let app = require('./src/server.js');

app.set('accessToken', accessToken);
let port = process.env.PORT || 8000;

// Server
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});