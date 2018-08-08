'use strict';

const Nodal = require('nodal');
const AccessToken = Nodal.require('app/models/access_token.js');

class LogoutController extends Nodal.Controller {

  index() {

    AccessToken.logout(this.params, (err, accessToken) => {

      this.respond(err || accessToken, ['access_token','expires_at']);

    });

  }

}

module.exports = LogoutController;
