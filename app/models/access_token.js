'use strict';

const Nodal = require('nodal');
const User = Nodal.require('app/models/user.js');

const Token = Nodal.require('app/services/token.js');
const Events = Nodal.require('app/services/events.js');

class AccessToken extends Nodal.Model {

  static generate(params, callback) {

    new AccessToken({
      user_id: params.user.get('id'),
      access_token: Token.generate(),
      token_type: params.type,
      expires_at: (new Date(new Date().valueOf() + (365 * 24 * 60 * 60 * 1000)))
    }).save((err,accessToken) => {

      if(err) return callback(err);

      accessToken.setJoined('user',params.user);

      callback(null,accessToken)

    });

  }

  static login(params, callback) {

    User.query()
      .where({username: params.body.username.toLowerCase()})
      .first((err, user) => {

        if (err || !user) {

          return callback(new Error('User not found'));

        }

        user.verifyPassword(params.body.password, (err, result) => {

          if (err || !result) {

            return callback(new Error('Invalid credentials'));

          }

          this.generate({user:user,type:'bearer'}, callback);

        });

      });

  }

  static verify(params, callback) {

    this.query()
      .join('user')
      .where({
        access_token: params.access_token,
        token_type: params.token_type || 'bearer',
        expires_at__gte: new Date()
      })
      .end((err, accessTokens) => {

        if (err || !accessTokens || !accessTokens.length) {

          return callback(new Error('Your access token is invalid.'));

        }

        let accessToken = accessTokens[0];

        if (!accessToken.joined('user')) {

          return callback(new Error('Your access token is invalid.'));

        }

        return callback(null, accessToken);

      });

  }

  static logout(params, callback) {

    this.verify(params.auth, (err, accessToken, user) => {

      if (err) return callback(err);

      return accessToken.destroy((err, model) => {
        callback(err, accessToken);
      });

    });

  }

  static forgotPassword(user, callback) {

    this.generate({
      user: user,
      type: 'reset'
    }, (err,accessToken) => {
      if(err) return callback(err);

      const data = {
        email: 'password-reset',
        user: user.format(),
        data: { token: accessToken.get('access_token') }
      };
      // schedule the email
      Events.email(data,{},callback);

    });

  }

  format(registration) {
    const modelObj = this.toObject(['access_token','expires_at']);
    if(this.joined('user')) modelObj.user = this.joined('user').format();
    modelObj.registration = registration === true;
    return modelObj;
  }

}

AccessToken.setDatabase(Nodal.require('db/main.js'));
AccessToken.setSchema(Nodal.my.Schema.models.AccessToken);

module.exports = AccessToken;
