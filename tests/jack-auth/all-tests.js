/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

exports.testBasicAuth = require("./basic-auth-tests");
exports.testAbstractAuth = require("./abstract-auth-tests");

if (require.main === module.id)
    require("test/runner").run(exports);
