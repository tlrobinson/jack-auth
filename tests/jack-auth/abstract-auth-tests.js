/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

var assert = require("test/assert"),
    BasicAuth = require("jack-auth/auth/basic.js"),
    AbstractHandler = require("jack-auth/auth/abstract/handler.js"),
    AbstractRequest = require("jack-auth/auth/abstract/request.js");
/*,
    Utils       = require("jack/utils"),
    MockRequest = require("jack/mock").MockRequest,
    File        = require("file"),
    Request     = require("jack/request").Request,
    BinaryIO    = require("binary").BinaryIO;
*/    

exports.testTrue = function() {
    assert.isEqual('fred', 'fred');
}
