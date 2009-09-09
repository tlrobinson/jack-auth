/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/digest/md5.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var Hash = require('hash').Hash,
    md5 = require('md5').hash,
    AbstractHandler = require('jack-auth/auth/abstract/handler').AbstractHandler,
    DigestRequest = require("jack-auth/auth/digest/request").DigestRequest,
    DigestParams = require('jack-auth/auth/digest/params'),
    DigestNonce = require('jack-auth/auth/digest/nonce');

/////////////////
// Digest helpers
/////////////////

var H = md5;

var qopSupported = ['auth']; // 'auth-int'],

var A1 = function(auth, password) {
    return [auth.username, auth.realm, password].join(':');
};

var A2 = function(auth) {
    return [auth.method, auth.uri].join(':');
};

var KD = function(secret, data) {
    return H([secret, data].join(':'));
};

var digest = function(auth, password, passwordsHashed) {
    var passwordHash = passwordsHashed ? password : H(A1(auth, password));
    return KD(passwordHash, [ auth.nonce, auth.nc, auth.cnonce, auth.qop, H(A2(auth)) ].join(':'));
};


/////////////////
// Digest handler
/////////////////

var DigestMD5 = function(params) {
    AbstractHandler.call(this, params);
}

DigestMD5.prototype = Hash.update(Object.create(AbstractHandler.prototype), {

/*
    HA1: function(auth, password) {
        return md5(this.A1(auth, password));
    },

    HA2: function(auth) {
        return md5(this.A2(auth));
    },

    response: function() {
        if (this.qop == "auth" || this.qop == "auth-int") return md5([this.HA1(), this.nonce, this.nc, this.cnonce, this.qop, this.HA2()].join(':'));
        return md5([this.HA1(), this.nonce, this.HA2()].join(':'));
    },
*/
    
    // run() is the JSGI handler
    run: function(app) {

        var self = this;

        return function(env) {

            var request = new DigestRequest(env);

            if (!request.authorizationKey()) return self.Unauthorized();
            if (!request.isDigest()) return self.BadRequest();
            if (!request.isCorrectUri()) return self.BadRequest();

            if (!self.isValidQOP(request)) return self.BadRequest();
            if (!self.isValidOpaque(request)) return self.Unauthorized();
            if (!self.isValidDigest(request)) return self.Unauthorized();

            if (!request.decodeNonce().isValid()) return self.Unauthorized();
            if (!request.decodeNonce().isFresh()) return self.Unauthorized(self.issueChallenge({stale: true}));

            env['REMOTE_USER'] = request.username;
            return app(env);
        }
    },

    params: function(options) {
        return Hash.update(options || {}, {
            realm: this.realm,
            nonce: new DigestNonce.Nonce().toString(),
            opaque: md5(this.opaque),
            qop: qopSupported.join(',')
        });
    },

    issueChallenge: function(options) {
        return "Digest " + DigestParams.toStr(this.params(options));
    },

    isValidQOP: function(request) {
        return qopSupported.indexOf(request.qop) != -1;
    },

    isValidOpaque: function(request) {
        return md5(this.opaque) == request.opaque;
    },

    isValidDigest: function(request) {
        return digest(request, this.getPassword(request.username), this.passwordsHashed) == request.response;
    }
});

/********************************************************
 * exports
 ********************************************************/

exports.DigestMD5Middleware = function(app, options) {
    return new DigestMD5(options).run(app);
}

exports.DigestMD5 = DigestMD5;
exports.digest = digest;

/********************************************************
 * original ruby code for reference
 ********************************************************
require 'rack/auth/abstract/handler'
require 'rack/auth/digest/request'
require 'rack/auth/digest/params'
require 'rack/auth/digest/nonce'
require 'digest/md5'

module Rack
  module Auth
    module Digest
      # Rack::Auth::Digest::MD5 implements the MD5 algorithm version of
      # HTTP Digest Authentication, as per RFC 2617.
      #
      # Initialize with the [Rack] application that you want protecting,
      # and a block that looks up a plaintext password for a given username.
      #
      # +opaque+ needs to be set to a constant base64/hexadecimal string.
      #
      class MD5 < AbstractHandler

        attr_accessor :opaque

        attr_writer :passwords_hashed

        def initialize(*args)
          super
          @passwords_hashed = nil
        end

        def passwords_hashed?
          !!@passwords_hashed
        end

        def call(env)
          auth = Request.new(env)

          unless auth.provided?
            return unauthorized
          end

          if !auth.digest? || !auth.correct_uri? || !valid_qop?(auth)
            return bad_request
          end

          if valid?(auth)
            if auth.nonce.stale?
              return unauthorized(challenge(:stale => true))
            else
              env['REMOTE_USER'] = auth.username

              return @app.call(env)
            end
          end

          unauthorized
        end


        private

        QOP = 'auth'.freeze

        def params(hash = {})
          Params.new do |params|
            params['realm'] = realm
            params['nonce'] = Nonce.new.to_s
            params['opaque'] = H(opaque)
            params['qop'] = QOP

            hash.each { |k, v| params[k] = v }
          end
        end

        def challenge(hash = {})
          "Digest #{params(hash)}"
        end

        def valid?(auth)
          valid_opaque?(auth) && valid_nonce?(auth) && valid_digest?(auth)
        end

        def valid_qop?(auth)
          QOP == auth.qop
        end

        def valid_opaque?(auth)
          H(opaque) == auth.opaque
        end

        def valid_nonce?(auth)
          auth.nonce.valid?
        end

        def valid_digest?(auth)
          digest(auth, @authenticator.call(auth.username)) == auth.response
        end

        def md5(data)
          ::Digest::MD5.hexdigest(data)
        end

        alias :H :md5

        def KD(secret, data)
          H([secret, data] * ':')
        end

        def A1(auth, password)
          [ auth.username, auth.realm, password ] * ':'
        end

        def A2(auth)
          [ auth.method, auth.uri ] * ':'
        end

        def digest(auth, password)
          password_hash = passwords_hashed? ? password : H(A1(auth, password))

          KD(password_hash, [ auth.nonce, auth.nc, auth.cnonce, QOP, H(A2(auth)) ] * ':')
        end

      end
    end
  end
end
*/