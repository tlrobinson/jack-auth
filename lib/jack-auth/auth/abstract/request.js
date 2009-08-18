/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/abstract/request.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var AUTHORIZATION_KEYS = ['HTTP_AUTHORIZATION', 'X-HTTP_AUTHORIZATION', 'X_HTTP_AUTHORIZATION']

var AbstractRequest = function(env) {
    this.env = env;
}

AbstractRequest.prototype.provided = function () {
    return ! (authorization_key(this.env) );    
}

AbstractRequest.prototype.parts = function() {
  return this.env[authorization_key].split(' ', 2);
}

AbstractRequest.prototype.scheme = function() {
  return this.parts().first().downcase();
}

AbstractRequest.prototype.params = function() {
  return this.parts().last();
}

AbstractRequest.prototype.authorization_key = function() {
    var env = this.env;
    return AUTHORIZATION_KEYS.some( function(key) { env.indexOf(key) != -1 });
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