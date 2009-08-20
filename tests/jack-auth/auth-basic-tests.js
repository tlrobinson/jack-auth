/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /test/spec_rack_auth_basic.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var assert = require("test/assert"),
    base64 = require("base64"),
    MockRequest = require("jack/mock").MockRequest,
    Basic = require("jack-auth/auth/basic");

var BasicHandler = Basic.BasicHandler,
    BasicRequest = Basic.BasicRequest,
    BasicMiddleware = Basic.BasicMiddleware;

var realm = 'WallysWorld';

var usernameIsBoss = function(credentials) {
    return ('Boss' == credentials[0]);
}

var openApp = function(env) {
    return [ 200, {'Content-Type': 'text/plain'}, ["Hi " + env['REMOTE_USER']] ];
}

var basicApp = BasicMiddleware(openApp, realm, usernameIsBoss);

var doRequest = function(request, headers) {
    if (headers === undefined) headers = {};
    return request.GET('/', headers);
}

var doRequestWithBasicAuth = function(request, username, password) {
  return doRequest(request, {'HTTP_AUTHORIZATION': 'Basic ' + base64.encode(username + ':' + password)});
}

var doRequestWithCustomAuth = function(request, username, password) {
  return doRequest(request, {'HTTP_AUTHORIZATION': 'Custom ' + base64.encode(username + ':' + password)});
}

function assertBasicAuthChallenge(response) {
    assert.eq(401,                  response.status);
    assert.eq('text/plain',         response.headers['Content-Type']);
    assert.eq('0',                  response.headers['Content-Length']);
    assert.eq('Basic realm='+realm, response.headers['WWW-Authenticate']);
    assert.eq("",                   response.body);
}

/********************************************************
 * test BasicRequest
 ********************************************************/

exports.testBasicRequest = function() {
    var base64Credentials = base64.encode('username' + ':' + 'password');
    var env = MockRequest.envFor(null, "/", {'HTTP_AUTHORIZATION': 'Basic ' + base64Credentials});
    var req = new BasicRequest(env);

    assert.eq(true, req.isBasic());
    assert.eq(2, req.decodeCredentials().length);
    assert.eq('username', req.username);
    assert.eq('password', req.password);
}

/********************************************************
 * test BasicHandler
 ********************************************************/

exports.testBasicHandlerValidCredentials = function() {
    var handler = new BasicHandler(realm, usernameIsBoss);

    //test handler.issueChallenge
    assert.eq('Basic realm='+realm, handler.issueChallenge());

    //test handler.isValid == true
    var base64Credentials = base64.encode('Boss' + ':' + 'password');
    var env = MockRequest.envFor(null, "/", {'HTTP_AUTHORIZATION': 'Basic ' + base64Credentials});
    var req = new BasicRequest(env);

    assert.eq(true, handler.isValid(req));
}

exports.testBasicHandlerInvalidCredentials = function() {
    var handler = new BasicHandler(realm, usernameIsBoss);
    
    //test handler.isValid == false
    var base64Credentials = base64.encode('username' + ':' + 'password');
    var env = MockRequest.envFor(null, "/", {'HTTP_AUTHORIZATION': 'Basic ' + base64Credentials});
    var req = new BasicRequest(env);

    assert.eq(false, handler.isValid(req));
}

/********************************************************
 * test Basic Auth as Jack middleware
 ********************************************************/

// should challenge correctly when no credentials are specified
exports.testChallengeWhenNoCredentials = function() {
    var request = new MockRequest(basicApp);
    assertBasicAuthChallenge(doRequest(request));
}

// should challenge correctly when incorrect credentials are specified
exports.testChallengeWhenIncorrectCredentials = function() {
    var request = new MockRequest(basicApp);
    assertBasicAuthChallenge(doRequestWithBasicAuth(request, 'joe', 'password'));
}

// should return application output if correct credentials are specified
exports.testAcceptCorrectCredentials = function() {
    var request = new MockRequest(basicApp);
    var response = doRequestWithBasicAuth(request, 'Boss', 'password');

    assert.eq(200, response.status);
    assert.eq('Hi Boss', response.body);
}

// should return 400 Bad Request if different auth scheme used
exports.testBadRequestIfSchemeNotBasic = function() {
    var request = new MockRequest(basicApp);
    var response = doRequestWithCustomAuth(request, 'Boss', 'password');

    assert.eq(400,       response.status);
    assert.eq("",        response.body);
    assert.eq(undefined, response.headers['WWW-Authenticate']);
}

/*
require 'test/spec'

require 'rack/auth/basic'
require 'rack/mock'

context 'Rack::Auth::Basic' do

  def realm
    'WallysWorld'
  end

  def unprotected_app
    lambda { |env| [ 200, {'Content-Type' => 'text/plain'}, ["Hi #{env['REMOTE_USER']}"] ] }
  end

  def protected_app
    app = Rack::Auth::Basic.new(unprotected_app) { |username, password| 'Boss' == username }
    app.realm = realm
    app
  end

  setup do
    @request = Rack::MockRequest.new(protected_app)
  end

  def request_with_basic_auth(username, password, &block)
    request 'HTTP_AUTHORIZATION' => 'Basic ' + ["#{username}:#{password}"].pack("m*"), &block
  end

  def request(headers = {})
    yield @request.get('/', headers)
  end

  def assert_basic_auth_challenge(response)
    response.should.be.a.client_error
    response.status.should.equal 401
    response.should.include 'WWW-Authenticate'
    response.headers['WWW-Authenticate'].should =~ /Basic realm="#{Regexp.escape(realm)}"/
    response.body.should.be.empty
  end

  specify 'should challenge correctly when no credentials are specified' do
    request do |response|
      assert_basic_auth_challenge response
    end
  end

  specify 'should rechallenge if incorrect credentials are specified' do
    request_with_basic_auth 'joe', 'password' do |response|
      assert_basic_auth_challenge response
    end
  end

  specify 'should return application output if correct credentials are specified' do
    request_with_basic_auth 'Boss', 'password' do |response|
      response.status.should.equal 200
      response.body.to_s.should.equal 'Hi Boss'
    end
  end

  specify 'should return 400 Bad Request if different auth scheme used' do
    request 'HTTP_AUTHORIZATION' => 'Digest params' do |response|
      response.should.be.a.client_error
      response.status.should.equal 400
      response.should.not.include 'WWW-Authenticate'
    end
  end

  specify 'realm as optional constructor arg' do
    app = Rack::Auth::Basic.new(unprotected_app, realm) { true }
    assert_equal realm, app.realm
  end
end
*/