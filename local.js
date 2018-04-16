const yaml = require('js-yaml');
const get_config = require("./src/config.js");
let environment = 'prod';

global.config = "";

global.config = yaml.load(get_config(environment));
let app = require('./src/server.js');
let port = process.env.PORT || 8000;

// Server
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});