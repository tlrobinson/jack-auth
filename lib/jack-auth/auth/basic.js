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
    Hash = require("hash").Hash,
    AbstractHandler = require('jack-auth/auth/abstract/handler').AbstractHandler,
    AbstractRequest = require('jack-auth/auth/abstract/request').AbstractRequest;

/********************************************************
 * BasicRequest
 * inherits from AbstractRequest
 ********************************************************/

var BasicRequest = function(env) {
    AbstractRequest.call(this, env);
}

BasicRequest.prototype = Hash.update(Object.create(AbstractRequest.prototype), {
    
    isBasic: function() {
        return this.scheme.search(/^basic$/i) != -1;
    },

    decodeCredentials: function (str) {
        var decoded = base64.decode(str).split(':', 2);
        this.username = decoded[0];
        this.password = decoded[1];
    }
});

/********************************************************
 * BasicHandler
 * inherits from AbstractHandler
 ********************************************************/

var BasicHandler = function(params) {
    AbstractHandler.call(this, params);
}

BasicHandler.prototype = Hash.update(Object.create(AbstractHandler.prototype), {
    
    // run() is the JSGI handler
    run: function(app) {
        var self = this;

        return function(env) {

            var request = new BasicRequest(env);

            if (!request.authorizationKey()) return self.Unauthorized();
            if (!request.isBasic()) return self.BadRequest();
            if (!self.isValid(request)) return self.Unauthorized();
            
            env['REMOTE_USER'] = request.username;
            return app(env);
        }
    },

    issueChallenge: function() {
        return ('Basic realm=' + this.realm);
    },

    isValid: function(request) {
        return this.authenticator(request);
    }
});

/********************************************************
 * exports
 ********************************************************/

exports.BasicMiddleware = function(app, params) {
    return new BasicHandler(params).run(app);
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