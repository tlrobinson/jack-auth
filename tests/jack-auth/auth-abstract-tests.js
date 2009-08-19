/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

var assert = require("test/assert"),
    base64 = require("base64"),
    MockRequest = require("jack/mock").MockRequest,
    BasicAuth = require("jack-auth/auth/basic"),
    AbstractHandler = require("jack-auth/auth/abstract/handler").AbstractHandler,
    AbstractRequest = require("jack-auth/auth/abstract/request").AbstractRequest;

/*
 * tests for AbstractHandler
 */

exports.testBadRequest = function() {
    var handler = new AbstractHandler(null, null);
    var resp = handler.BadRequest();

    assert.eq(400, resp[0]);
    assert.eq('text/plain', resp[1]['Content-Type']);
    assert.eq('0', resp[1]['Content-Length']);
    assert.eq(0, resp[2].length);
}

exports.testUnauthorizedDefaultChallenge = function() {
    var testRealm = "testRealm";
    var handler = new AbstractHandler(testRealm, null);

    handler.issueChallenge = function() {
        return ('Basic realm=' + this.realm);
    }

    var resp = handler.Unauthorized();

    assert.eq(401, resp[0]);
    assert.eq('text/plain', resp[1]['Content-Type']);
    assert.eq('0', resp[1]['Content-Length']);
    assert.eq('Basic realm='+testRealm, resp[1]['WWW-Authenticate']);
    assert.eq(0, resp[2].length);

}

exports.testUnauthorizedCustomChallenge = function() {
    var testRealm = "testRealm";
    var handler = new AbstractHandler(testRealm, null);

    var realm = "Custom realm="+testRealm;
    var resp = handler.Unauthorized(realm);

    assert.eq(401, resp[0]);
    assert.eq('text/plain', resp[1]['Content-Type']);
    assert.eq('0', resp[1]['Content-Length']);
    assert.eq(realm, resp[1]['WWW-Authenticate']);
    assert.eq(0, resp[2].length);
}

/*
 * tests for AbstractRequest
 */

exports.testUnauthorizedRequest = function() {
    var env = MockRequest.envFor(null, "/", {});
    var req = new AbstractRequest(env);

    assert.eq(false, req.authorizationKeyFound());
}

exports.testAuthorizedRequest = function() {
    var base64Credentials = base64.encode('username' + ':' + 'password');
    var env = MockRequest.envFor(null, "/", {'HTTP_AUTHORIZATION': 'Basic ' + base64Credentials});
    var req = new AbstractRequest(env);

    assert.eq(true, req.authorizationKeyFound());
    assert.eq('HTTP_AUTHORIZATION', req.authorizationKey());
    assert.eq('basic', req.scheme());
    assert.eq(base64Credentials, req.credentials());
}