/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/digest/request.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var Hash = require("hash").Hash,
    AbstractRequest = require('jack/auth/abstract/request').AbstractRequest,
    DigestParams = require('jack/auth/digest/params'),
    DigestNonce = require('jack/auth/digest/nonce');

var DigestRequest = function(env) {
    AbstractRequest.call(this, env);
}

DigestRequest.prototype = Hash.update(Object.create(AbstractRequest.prototype), {

    isDigest: function() {
        return this.scheme.search(/^digest$/i) != -1;
    },

    method: function() {
        return this.env['REQUEST_METHOD'];
    },

    isCorrectUri: function() {
        return (this.env['SCRIPT_NAME'] + this.env['PATH_INFO'] == this.uri);
    },

    decodeNonce: function() {
        if (this._decodedNonce) return this._decodedNonce;
        return this._decodedNonce = DigestNonce.decode(this.nonce);
    },

    decodeCredentials: function (str) {
        DigestParams.parse(this, str);
    }

});

/********************************************************
 * exports
 ********************************************************/

exports.DigestRequest = DigestRequest;

/********************************************************
 * original ruby code for reference
 ********************************************************
require 'rack/auth/abstract/request'
require 'rack/auth/digest/params'
require 'rack/auth/digest/nonce'

module Rack
  module Auth
    module Digest
      class Request < Auth::AbstractRequest

        def method
          @env['rack.methodoverride.original_method'] || @env['REQUEST_METHOD']
        end

        def digest?
          :digest == scheme
        end

        def correct_uri?
          (@env['SCRIPT_NAME'].to_s + @env['PATH_INFO'].to_s) == uri
        end

        def nonce
          @nonce ||= Nonce.parse(params['nonce'])
        end

        def params
          @params ||= Params.parse(parts.last)
        end

        def method_missing(sym)
          if params.has_key? key = sym.to_s
            return params[key]
          end
          super
        end

      end
    end
  end
end
*/