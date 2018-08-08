'use strict';

const Nodal = require('nodal');

const FB = Nodal.require('app/services/facebook.js');
const Google = Nodal.require('app/services/google.js');

const providerList = ['facebook','google'];

class OauthUser extends Nodal.Model {

  static getUserFromProvider(data,callback) {
    if(data.provider == 'facebook') FB.getUser(data.oauth_token,callback);
    else if(data.provider == 'google') Google.getUser(data.oauth_token,data.access_token,callback);
    else callback(new Error('Unsupported OAuth Provider'));
  }

}

OauthUser.setDatabase(Nodal.require('db/main.js'));
OauthUser.setSchema(Nodal.my.Schema.models.OauthUser);

OauthUser.validates('user_id', 'required', v => v);
OauthUser.validates('provider_id', 'required', v => v);
OauthUser.validates('provider', 'invalid', v => { return providerList.indexOf(v) != -1 });

module.exports = OauthUser;
