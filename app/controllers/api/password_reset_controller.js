'use strict';

const Nodal = require('nodal');
const User = Nodal.require('app/models/user.js');
const AccessToken = Nodal.require('app/models/access_token.js');

const Relationships = Nodal.require('app/relationships.js');

const AuthController = Nodal.require('app/controllers/auth_controller.js');

class PasswordResetController extends AuthController {

  index() {

    if(!this.params.query.token)
      this.respond(new Error('missing required token'));

    const auth = {
      access_token: this.params.query.token,
      token_type: 'reset'
    }

    AccessToken.verify(auth, (err,accessToken) => {
      if(err) return this.respond(err);
      this.respond(accessToken.joined('user'));
    });


  }

  create() {

    // get hash for reset
    this.authorize('public',(user) => {
      // a user or email address is required
      if(!user && !this.params.body.email)
        return this.respond(new Error('missing required email'));

      // if already logged in
      if(user) return AccessToken.forgotPassword(user, (err,result) => {
        return this.respond(err || {message:'password reset email sent'});
      });

      // if not logged in
      else User.findBy('email', this.params.body.email.toLowerCase(), (err, user) => {
        if(err || !user) return this.respond(new Error('user not found'));

        AccessToken.forgotPassword(user, (err,result) => {
          return this.respond(err || {message:'password reset email sent'});
        });

      });

    });

  }

  put() {

    if(!this.params.body.token || !this.params.body.password)
      this.respond(new Error('missing required token or password'));

    const auth = {
      access_token: this.params.body.token,
      token_type: 'reset'
    }

    AccessToken.verify(auth, (err,accessToken) => {
      if(err) return this.respond(err);

      accessToken.joined('user').set('password',this.params.body.password);
      accessToken.joined('user').save((err,user) => {
        if(err) return this.respond(err);

        accessToken.destroy();
        AccessToken.generate({user:user,type:'bearer'}, (err,accessToken) => {

          this.respond(err || accessToken.format());

        });

      });

    });

  }

}

module.exports = PasswordResetController;
