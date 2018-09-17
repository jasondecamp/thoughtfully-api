'use strict';

const Nodal = require('nodal');

class CORSMiddleware {

  exec(controller, callback) {

    controller.allowOrigin(process.env.ENV_DOMAIN);
    controller.appendHeader('Access-Control-Allow-Headers', 'Authorization');
    callback(null);

  }

}

module.exports = CORSMiddleware;
