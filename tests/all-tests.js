/*
 * Copyright Neville Burnell
 * See README at http://github.com/nevilleburnell/jack-auth for license
 */

exports.testJackAuth = require("./jack-auth/all-tests");

if (require.main === module.id)
    require("test/runner").run(exports);
