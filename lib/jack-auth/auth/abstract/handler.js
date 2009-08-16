/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/abstract/handler.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var AbstractHandler = function(realm, authenticator) {
    this.realm = realm;
    this.authenticator = authenticator;
}

AbstractHandler.prototype.Unauthorized = function(app, www_authenticate) {

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

AbstractHandler.prototype.Bad_Request = function(env) {
    return [ 400,
      { 'Content-Type': 'text/plain',
        'Content-Length' : '0'
      },
      []
    ]
}

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