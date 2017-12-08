"use strict";
process.env.BABEL_CACHE_PATH = "/var/lib/openshift/5735da8b0c1e66f813000109/app-root/data/.babel.json";
/**
 * Load config
 */
//var config = require('config')

/**
 * Transpile es6
 */
require('babel-polyfill')
require('babel-register')


/**
 * Launch server!
 */
var server = require('./fillkco/server').default

// server.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
//   console.log(`Application worker ${process.pid} started...`);
// });

// server.listen(process.env.PORT || 8000, 'localhost', function () {
//   console.log('%s listening at %s', server.name, server.url)
// })

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(server_port, server_ip_address, function(){
    console.log('%s listening at %s', server.name, server.url)
});
