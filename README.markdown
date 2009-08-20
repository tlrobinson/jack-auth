Jack::Auth
===========
Port of Rack::Auth to Jack and Narwhal

Status
------
* Basic: Completed
* OpenID: Outstanding
* Digest: Outstanding

History
-------
* 0.1 First Release. Basic Authentication. 2009-08-20

Usage: Basic Authentication
---------------------------
    basicAuth = require("jack-auth/auth/basic").BasicMiddleware;

    var myRealm = "my realm";

    // the authenticator takes a username and password and returns
    // true or false if the pair is accepted or rejected

    var myAuthenticator = function(username, password) {
        if (username == 'admin' && password == 'pass') return true; //allow
        return false; //deny
    }

    var myApp = function(env) {
        return [200,{"Content-Type":"text/plain"},["Hello Admin!"]];
    }

    var myAppWithBasicAuth = basicAuth(myApp, myRealm, myAuthenticator);

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

