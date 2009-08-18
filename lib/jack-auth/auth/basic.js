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

var AbstractHandler = require('jack-auth/auth/abstract/handler'),
    AbstractRequest = require('jack-auth/auth/abstract/request');

/********************************************************
 * BasicHandler
 * inherits from AbstractHandler
 ********************************************************/

var BasicHandler = function(realm, authenticator) {
    AbstractHandler.AbstractHandler.call(realm, authenticator);
}

BasicHandler.prototype = Object.create(AbstractHandler.AbstractHandler.prototype);

// BasicHandler.middleware() is the JSGI handler
BasicHandler.handler = function(app) {

    var self = this;

    return function(env) {

        var auth = new BasicRequest(env);

        if (!auth.provided()) return self.Unauthorized();
        if (!auth.basic()) return self.Bad_Request();

        if (self.is_valid(auth)) {
            env['REMOTE_USER'] = auth.username();
            return app.call(env);
        }
        return self.Unauthorized();
    }
}

BasicHandler.challenge = function() {
    return ('Basic realm=' + this.realm);
}

BasicHandler.is_valid = function(auth) {
    return this.authenticator.call(auth.credentials);
}

BasicHandler.username = function() {
    return this.credentials.first;
}

/********************************************************
 * BasicRequest
 * inherits from AbstractRequest
 ********************************************************/

var BasicRequest = function(env) {
    AbstractRequest.AbstractRequest.call(env);
}

BasicRequest.prototype = Object.create(AbstractRequest.AbstractRequest.prototype);

BasicRequest.is_basic = function() {
    return ('basic' == this.scheme);
}

BasicRequest.credentials = function () {
//           @credentials ||= params.unpack("m*").first.split(/:/, 2)
}

/********************************************************
 * exports
 ********************************************************/
exports.BasicHandler = new BasicHandler().handler;

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