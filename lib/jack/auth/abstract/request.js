/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/abstract/request.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var AUTHORIZATION_KEYS = ['HTTP_AUTHORIZATION', 'X-HTTP_AUTHORIZATION', 'X_HTTP_AUTHORIZATION'];

var AbstractRequest = function(env) {
    this.env = env;

    if (!this.authorizationKey()) return;

    var parts = this.env[this.authorizationKey()].match(/(\w+) (.*)/);      

    this.scheme =  parts[1];

    this.decodeCredentials(parts.pop());
}

AbstractRequest.prototype = {

    authorizationKey: function() {
        if (this._authorizationKey) return this._authorizationKey;

        for (var i=0; i < AUTHORIZATION_KEYS.length; i++) {
            var key = AUTHORIZATION_KEYS[i];
            if (this.env[key]) return this._authorizationKey = key;
        }
    }
}

/********************************************************
 * exports
 ********************************************************/
exports.AbstractRequest = AbstractRequest;

/********************************************************
 * original ruby code for reference
 ********************************************************
 module Rack
   module Auth
     class AbstractRequest

       def initialize(env)
         @env = env
       end

       def provided?
         !authorization_key.nil?
       end

       def parts
         @parts ||= @env[authorization_key].split(' ', 2)
       end

       def scheme
         @scheme ||= parts.first.downcase.to_sym
       end

       def params
         @params ||= parts.last
       end


       private

       AUTHORIZATION_KEYS = ['HTTP_AUTHORIZATION', 'X-HTTP_AUTHORIZATION', 'X_HTTP_AUTHORIZATION']

       def authorization_key
         @authorization_key ||= AUTHORIZATION_KEYS.detect { |key| @env.has_key?(key) }
       end

     end

   end
 end
 */