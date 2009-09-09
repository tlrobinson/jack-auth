/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/abstract/handler.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var Hash = require("hash").Hash;

// params:
// authenticator, optional
// realm, optional
var AbstractHandler = function(params) {
    if (params !== undefined) Hash.update(this, params);

    //defaults
    if (this.authenticator === undefined) this.authenticator = function(){return false;}; //should we default authenticator() ?
}

AbstractHandler.prototype = {
    Unauthorized: function(wwwAuthenticate) {
        if (wwwAuthenticate === undefined) wwwAuthenticate = this.issueChallenge();

        return {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length' : '0',
                'WWW-Authenticate': wwwAuthenticate
            },
            body: []
        };
    },

    BadRequest: function() {
        return {
            status: 400,
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length' : '0'
            },
            body: []
        };
    }
};

/********************************************************
 * exports
 ********************************************************/
exports.AbstractHandler = AbstractHandler;

/********************************************************
 * original ruby code for reference
 ********************************************************
 module Rack
   module Auth
     # Rack::Auth::AbstractHandler implements common authentication functionality.
     #
     # +realm+ should be set for all handlers.

     class AbstractHandler

       attr_accessor :realm

       def initialize(app, realm=nil, &authenticator)
         @app, @realm, @authenticator = app, realm, authenticator
       end


       private

       def unauthorized(www_authenticate = challenge)
         return [ 401,
           { 'Content-Type' => 'text/plain',
             'Content-Length' => '0',
             'WWW-Authenticate' => www_authenticate.to_s },
           []
         ]
       end

       def bad_request
         return [ 400,
           { 'Content-Type' => 'text/plain',
             'Content-Length' => '0' },
           []
         ]
       end

     end
   end
 end
 */