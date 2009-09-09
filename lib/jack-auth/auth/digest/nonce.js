/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/digest/nonce.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var base64 = require("base64"),
    trim = require("util").trim,
    Hash = require("hash").Hash,
    md5 = require('md5');

// params include
//
// givenDigest, optional:
// timestamp, optional:
// privateKey needs to set to a constant string
// timeLimit, optional integer (number of milliseconds) to limit the validity of the generated nonces.

var decode = function(str) {
    var parts = base64.decode(str).match(/(\d+) (.*)/);
    
    return new Nonce({
        timestamp: parseInt(parts[1]),
        digest: parts.pop()
    });
};


var Nonce = function(params) {
    if (params) Hash.update(this, params);

    //defaults
    if (!this.timestamp) this.timestamp = new Date().getTime();   //milliseconds since 1970
}

Nonce.prototype = {

    isValid: function() {
        return this.digest == this.toDigest();
    },

    toString: function() {
        return trim(base64.encode([this.timestamp, this.toDigest()].join(' ')));
    },

    toDigest: function() {
        return base64.encode(md5.hash([this.timestamp, this.privateKey].join(':')));
    },

    isFresh: function() {
        if (!this.timeLimit) return true; // no time limit
        return (new Date().getTime() - this.timestamp < this.timeLimit);
    }
};

/********************************************************
 * exports
 ********************************************************/

exports.Nonce = Nonce;
exports.decode = decode;

/********************************************************
 * original ruby code for reference
 ********************************************************
require 'digest/md5'

module Rack
  module Auth
    module Digest
      # Rack::Auth::Digest::Nonce is the default nonce generator for the
      # Rack::Auth::Digest::MD5 authentication handler.
      #
      # +private_key+ needs to set to a constant string.
      #
      # +time_limit+ can be optionally set to an integer (number of seconds),
      # to limit the validity of the generated nonces.

      class Nonce

        class << self
          attr_accessor :private_key, :time_limit
        end

        def self.parse(string)
          new(*string.unpack("m*").first.split(' ', 2))
        end

        def initialize(timestamp = Time.now, given_digest = nil)
          @timestamp, @given_digest = timestamp.to_i, given_digest
        end

        def to_s
          [([ @timestamp, digest ] * ' ')].pack("m*").strip
        end

        def digest
          ::Digest::MD5.hexdigest([ @timestamp, self.class.private_key ] * ':')
        end

        def valid?
          digest == @given_digest
        end

        def stale?
          !self.class.time_limit.nil? && (@timestamp - Time.now.to_i) < self.class.time_limit
        end

        def fresh?
          !stale?
        end

      end
    end
  end
end
*/