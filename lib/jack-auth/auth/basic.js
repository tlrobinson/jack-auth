/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * implements HTTP Basic Authentication, as per RFC 2617
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/basic.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var base64 = require("base64"),
    AbstractHandler = require('jack-auth/auth/abstract/handler').AbstractHandler,
    AbstractRequest = require('jack-auth/auth/abstract/request').AbstractRequest;

//var jsDump = require('test/jsdump').jsDump;
//var print = require('system').print;

/********************************************************
 * BasicRequest
 * inherits from AbstractRequest
 ********************************************************/

var BasicRequest = function(env) {
    AbstractRequest.call(this, env);
}

BasicRequest.prototype = Object.create(AbstractRequest.prototype);

BasicRequest.prototype.isBasic = function() {
    return ('basic' == this.scheme());
}

BasicRequest.prototype.decodeCredentials = function () {
    if (this.username === undefined) {
        var decoded = base64.decode(this.credentials()).split(':');
        this.username = decoded[0];
        this.password = decoded[1];
    }
    return [this.username, this.password];
}

/********************************************************
 * BasicHandler
 * inherits from AbstractHandler
 ********************************************************/

var BasicHandler = function(realm, authenticator) {
    AbstractHandler.call(this, realm, authenticator);
}

BasicHandler.prototype = Object.create(AbstractHandler.prototype);

// BasicHandler.run() is the JSGI handler
BasicHandler.prototype.run = function(app) {

    var self = this;

    return function(env) {

        var auth = new BasicRequest(env);

        if (!auth.authorizationKeyFound()) return self.Unauthorized();
        if (!auth.isBasic()) return self.BadRequest();

        if (self.isValid(auth)) {
            env['REMOTE_USER'] = auth.username;
            return app(env);
        }
        return self.Unauthorized();
    }
}

BasicHandler.prototype.issueChallenge = function() {
    return ('Basic realm=' + this.realm);
}

BasicHandler.prototype.isValid = function(auth) {
    return this.authenticator(auth.decodeCredentials());
}

/********************************************************
 * exports
 ********************************************************/

exports.BasicMiddleware = function(app, realm, authenticator) {
    return new BasicHandler(realm, authenticator).run(app);
}

exports.BasicHandler = BasicHandler; //for tests
exports.BasicRequest = BasicRequest; //for tests


/********************************************************
 * original ruby code for reference
 ********************************************************
 require 'rack/auth/abstract/handler'
 require 'rack/auth/abstract/request'

 module Rack
   module Auth
     # Rack::Auth::Basic implements HTTP Basic Authentication, as per RFC 2617.
     #
     # Initialize with the Rack application that you want protecting,
     # and a block that checks if a username and password pair are valid.
     #
     # See also: <tt>example/protectedlobster.rb</tt>

     class Basic < AbstractHandler

       def call(env)
         auth = Basic::Request.new(env)

         return unauthorized unless auth.provided?

         return bad_request unless auth.basic?

         if valid?(auth)
           env['REMOTE_USER'] = auth.username

           return @app.call(env)
         end

         unauthorized
       end


       private

       def challenge
         'Basic realm="%s"' % realm
       end

       def valid?(auth)
         @authenticator.call(*auth.credentials)
       end

       class Request < Auth::AbstractRequest
         def basic?
           :basic == scheme
         end

         def credentials
           @credentials ||= params.unpack("m*").first.split(/:/, 2)
         end

         def username
           credentials.first
         end
       end

     end
   end
 end
 */