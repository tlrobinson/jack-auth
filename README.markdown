Jack::Auth
===========
Port of Rack::Auth to Jack and Narwhal

Status
------
* Basic: Completed
* Digest: Completed. Tests outstanding.
* OpenID: Outstanding

History
-------
* 2009-09-09 V0.4 Digest Authentication.
* 2009-09-04 V0.3 Conform to Jack response specification change from array to object.  BasicMiddleware() API change.
* 2009-08-26 V0.2 Changed authenticator() parameters.
* 2009-08-20 V0.1 First Release. Basic Authentication. 

Usage: Basic Authentication
---------------------------
    basicAuth = require("jack/auth/basic").BasicMiddleware;

    var myRealm = "my realm";

    // the authenticator takes an object which exposes username and password and returns
    // true or false if the pair is accepted or rejected

    var myAuthenticator = function(auth) {
        if (auth.username == 'admin' && auth.password == 'pass') return true; //allow
        return false; //deny
    }

    var myApp = function(env) {
        return {
            status: 200,
            headers: {"Content-Type": "text/plain"},
            body: ["Hello Admin!"]
        }
    }

    var myAppWithBasicAuth = basicAuth(myApp, {
        realm: myRealm,
        authenticator: myAuthenticator
    });

Usage: Digest Authentication
---------------------------
    digestAuth = require("jack/auth/digest/md5").DigestMD5Middleware;

    var myRealm = "my realm";

    // getPassword returns the password [clear text or hashed] for a username
    
    var getPassword = function(username) {
        return {'admin': 'password'}[username];
    }

    var myApp = function(env) {
        return {
            status: 200,
            headers: {"Content-Type": "text/plain"},
            body: ["Hello Admin!"]
        }
    }

    var myAppWithDigestAuth = digestAuth(myApp, {
        realm: myRealm,
        opaque: "this-is-a-secret",
        getPassword: getPassword
    });

Contributors
------------
* [Neville Burnell][2]

Acknowledgments
---------------

This software was influenced by [Rack::Auth][1]

[1]:http://github.com/rack/rack
[2]:http://github.com/nevilleburnell

License
-------
Copyright (c) 2009 Neville Burnell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

