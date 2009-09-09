/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 *
 * Acknowledgements:
 * Port of /lib/rack/auth/digest/params.rb from Rack project
 * http://github.com/rack/rack
 * Original ruby source is included
 */

var Hash = require("hash").Hash,
    Util = require("util");

var UNQUOTED = ['qop', 'nc', 'stale'];

var dequote = function(str) {
    var m = str.match(/^["'](.*)['"]$/);
    return  m ? m.pop() : str;
}

var extractHeaders = function(str) {
    return str.match(/(\w+\=(?:"[^\"]+"|[^,]+))/g);
}

var parse = function(h, str) {
    extractHeaders(str).forEach(function(param) {
        var kv = param.match(/(\w+)=(.*)/);
        h[kv[1]] = dequote(kv[2]);
    });

    return h;
};

var toStr = function(h) {
    return Hash.map(h, function(k, v) {
        return String.concat(k, "=", UNQUOTED.indexOf(k) != -1 ? v.toString() : Util.enquote(v.toString()));
    }).join(', ');
};


/********************************************************
 * exports
 ********************************************************/

exports.toStr = toStr;
exports.parse = parse;

/********************************************************
 * original ruby code for reference
 ********************************************************
module Rack
  module Auth
    module Digest
      class Params < Hash

        def self.parse(str)
          split_header_value(str).inject(new) do |header, param|
            k, v = param.split('=', 2)
            header[k] = dequote(v)
            header
          end
        end

        def self.dequote(str) # From WEBrick::HTTPUtils
          ret = (/\A"(.*)"\Z/ =~ str) ? $1 : str.dup
          ret.gsub!(/\\(.)/, "\\1")
          ret
        end

        def self.split_header_value(str)
          str.scan( /(\w+\=(?:"[^\"]+"|[^,]+))/n ).collect{ |v| v[0] }
        end

        def initialize
          super

          yield self if block_given?
        end

        def [](k)
          super k.to_s
        end

        def []=(k, v)
          super k.to_s, v.to_s
        end

        UNQUOTED = ['qop', 'nc', 'stale']

        def to_s
          inject([]) do |parts, (k, v)|
            parts << "#{k}=" + (UNQUOTED.include?(k) ? v.to_s : quote(v))
            parts
          end.join(', ')
        end

        def quote(str) # From WEBrick::HTTPUtils
          '"' << str.gsub(/[\\\"]/o, "\\\1") << '"'
        end

      end
    end
  end
end
*/