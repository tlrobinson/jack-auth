/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

var assert = require("test/assert"),
    base64 = require("base64"),
    MockRequest = require("jack/mock").MockRequest,
    BasicAuth = require("jack/auth/basic"),
    AbstractHandler = require("jack/auth/abstract/handler").AbstractHandler,
    AbstractRequest = require("jack/auth/abstract/request").AbstractRequest;

/*
 * tests for AbstractHandler
 */

exports.testBadRequest = function() {
    var handler = new AbstractHandler();
    var resp = handler.BadRequest();

    assert.eq(400, resp.status);
    assert.eq('text/plain', resp.headers['Content-Type']);
    assert.eq('0', resp.headers['Content-Length']);
    assert.eq(0, resp.body.length);
}

exports.testUnauthorizedDefaultChallenge = function() {
    var testRealm = "testRealm";
    var handler = new AbstractHandler({realm:testRealm});

    handler.issueChallenge = function() {
        return ('Basic realm=' + this.realm);
    }

    var resp = handler.Unauthorized();

    assert.eq(401, resp.status);
    assert.eq('text/plain', resp.headers['Content-Type']);
    assert.eq('0', resp.headers['Content-Length']);
    assert.eq('Basic realm='+testRealm, resp.headers['WWW-Authenticate']);
    assert.eq(0, resp.body.length);

}

exports.testUnauthorizedCustomChallenge = function() {
    var testRealm = "testRealm";
    var handler = new AbstractHandler({realm:testRealm});

    var realm = "Custom realm="+testRealm;
    var resp = handler.Unauthorized(realm);

    assert.eq(401, resp.status);
    assert.eq('text/plain', resp.headers['Content-Type']);
    assert.eq('0', resp.headers['Content-Length']);
    assert.eq(realm, resp.headers['WWW-Authenticate']);
    assert.eq(0, resp.body.length);
}