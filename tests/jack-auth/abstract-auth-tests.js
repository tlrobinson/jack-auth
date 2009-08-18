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
    var handler = new AbstractHandler(null, null);
    var resp = handler.BadRequest();

    assert.eq(resp[0], 400);
    assert.eq(resp[1]['Content-Type'], 'text/plain');
    assert.eq(resp[1]['Content-Length'], '0');
    assert.eq(resp[2].length, 0);
}

exports.testUnauthorizedDefaultChallenge = function() {
//    var env = MockRequest.envFor(null, "/", {});
    var otherRealm = "otherRealm";
    var testRealm = "testRealm";
    var handler = new AbstractHandler(testRealm, null);

    handler.challenge = function() {
        return ('Basic realm=' + this.realm);
    }

    var resp = handler.Unauthorized();

    assert.eq(resp[0], 401);
    assert.eq(resp[1]['Content-Type'], 'text/plain');
    assert.eq(resp[1]['Content-Length'], '0');
    assert.eq(resp[1]['WWW-Authenticate'], 'Basic realm='+testRealm);
    assert.eq(resp[2].length, 0);

}

exports.testUnauthorizedCustomChallenge = function() {
//    var env = MockRequest.envFor(null, "/", {});

    var otherRealm = "otherRealm";
    var testRealm = "testRealm";
    var handler = new AbstractHandler(testRealm, null);

    handler.challenge = function() {
        return ('Basic realm=' + this.realm);
    }

    var resp = handler.Unauthorized("Basic realm="+otherRealm);

    assert.eq(resp[0], 401);
    assert.eq(resp[1]['Content-Type'], 'text/plain');
    assert.eq(resp[1]['Content-Length'], '0');
    assert.eq(resp[1]['WWW-Authenticate'], 'Basic realm='+otherRealm);
    assert.eq(resp[2].length, 0);
}

/*
function(app, www_authenticate) {

    if (!www_authenticate) www_authenticate = this.challenge();

    var options = this.options;

    return function(env) {
        return [ 401,
            { 'Content-Type': 'text/plain',
              'Content-Length' : '0',
              'WWW-Authenticate': String(www_authenticate)
            },
            []
        ]
    }
}
*/