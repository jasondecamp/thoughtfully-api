'use strict';

const Nodal = require('nodal');
const AccessToken = Nodal.require('app/models/access_token.js');

class LoginController extends Nodal.Controller {

  create() {

    AccessToken.login(this.params, (err, accessToken) => {

      this.respond(err || accessToken.format());

    });

  }

}

module.exports = LoginController;
