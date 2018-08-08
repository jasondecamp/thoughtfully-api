'use strict';

const crypto = require('crypto');

const Token = {
  generate: function() {
    return crypto
      .createHmac('md5', crypto.randomBytes(512).toString())
      .update([].slice.call(arguments).join(':'))
      .digest('hex');
  }
};

module.exports = Token
