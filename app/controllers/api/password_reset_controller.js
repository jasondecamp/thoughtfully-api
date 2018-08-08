'use strict';

const Nodal = require('nodal');
const User = Nodal.require('app/models/user.js');
const AccessToken = Nodal.require('app/models/access_token.js');

const Relationships = Nodal.require('app/relationships.js');

const AuthController = Nodal.require('app/controllers/auth_controller.js');

class V1PasswordResetController extends AuthController {

  index() {

    // get hash for reset
    this.authorize('public',(user) => {

      // a user or email address is required
      if(!user && !this.params.query.email)
        this.respond(new Error('missing required email'));

      // if already logged in
      if(user) AccessToken.forgotPassword(user, (err,result) => {
        this.respond(err || {message:'password reset email sent'});
      });

      // if not logged in
      else User.findBy('email', this.params.query.email.toLowerCase(), (err, user) => {
        if(err || !user) return this.respond(new Error('user not found'));

        AccessToken.forgotPassword(user, (err,result) => {
          this.respond(err || {message:'password reset email sent'});
        });

      });

    });

  }

  create() {

    if(!this.params.body.token || !this.params.body.password)
      this.respond(new Error('missing required token or password'));

    const auth = {
      access_token: this.params.body.token,
      token_type: 'reset'
    }

    AccessToken.verify(auth, (err,accessToken,user) => {
      if(err) return this.respond(err);

      user.set('password',this.params.body.password);
      user.save((err,user) => {
        if(err) return this.respond(err);

        accessToken.destroy();
        this.respond(user);

      });

    });

  }

}

module.exports = V1PasswordResetController;
