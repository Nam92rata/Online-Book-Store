require("babel-register")({
    presets: ['env']
});
module.exports = require('./httpserver.js');