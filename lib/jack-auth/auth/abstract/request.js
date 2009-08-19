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
}

AbstractRequest.prototype.authorizationKeyFound = function () {
    return !(this.authorizationKey() === undefined);
}

AbstractRequest.prototype.parts = function() {
    return this.env[this.authorizationKey()].split(' ');
}

AbstractRequest.prototype.scheme = function() {
    var parts =  this.parts();
    return parts[0].toLowerCase();  //first
}

AbstractRequest.prototype.credentials = function() {
    var parts =  this.parts();
    return parts[parts.length - 1];  //last
}

AbstractRequest.prototype.authorizationKey = function() {
    for (var i=0; i < AUTHORIZATION_KEYS.length; i++) {
        var key = AUTHORIZATION_KEYS[i];
        if (this.env[key] !== undefined) return key;
    }

    return undefined;
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