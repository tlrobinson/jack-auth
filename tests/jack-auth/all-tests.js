/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

exports.testAuthAbstract = require("./auth-abstract-tests");
exports.testAuthBasic = require("./auth-basic-tests");

if (require.main === module.id)
    require("test/runner").run(exports);
