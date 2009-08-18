/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

var assert = require("test/assert"),
    MockRequest = require("jack/mock").MockRequest,
    BasicAuth = require("jack-auth/auth/basic.js"),
    AbstractHandler = require("jack-auth/auth/abstract/handler.js").AbstractHandler,
    AbstractRequest = require("jack-auth/auth/abstract/request.js").AbstractRequest;
/*,
    Utils       = require("jack/utils"),
    MockRequest = require("jack/mock").MockRequest,
    File        = require("file"),
    Request     = require("jack/request").Request,
    BinaryIO    = require("binary").BinaryIO;
*/    

exports.testBadRequest = function() {
    var env = MockRequest.envFor(null, "/", {});
    var handler = new AbstractHandler(null, null);    
    var resp = handler.BadRequest(env);

    assert.eq(resp[0], 400);
    assert.eq(resp[1]['Content-Type'], 'text/plain');
    assert.eq(resp[1]['Content-Length'], '0');
    assert.eq(resp[2].length, 0);
}