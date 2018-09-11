'use strict';

const Nodal = require('nodal');
const AccessToken = Nodal.require('app/models/access_token');

class AuthController extends Nodal.Controller {

  // Allowed authorization levels: public, user
  authorize(level,callback) {

    this.params.uuid = this._requestHeaders.uuid || this._requestHeaders['x-uuid'] || false;

    if(level == 'public' && !this.params.auth.access_token) {
      return callback(false);
    }

    this.setHeader('Cache-Control', 'no-store');
    this.setHeader('Pragma', 'no-cache');

    AccessToken.verify(this.params.auth, (err,accessToken) => {
      if(err) return this.unauthorized('invalid access token');
      callback(accessToken.joined('user'));
    });

  }

}

module.exports = AuthController;
