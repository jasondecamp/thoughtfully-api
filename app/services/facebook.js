'use strict';

/*
 * Facebook Identity Verification
 * https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
 * https://developers.facebook.com/docs/facebook-login/multiple-providers
 *
 */

const FB = require('fb');

const appId = process.env.FACEBOOK_APP_ID;
const appSecret = process.env.FACEBOOK_SECRET;
// what does this do?
FB.options({
  appId:appId,
  appSecret:appSecret,
  accessToken:`${appId}|${appSecret}`
});

function verifyToken(token,callback) {
  FB.api(`/debug_token?input_token=${token}`, (response) => {
    if(response.error || !response.data.is_valid ||
      response.data.app_id != appId ||
      response.data.scopes.indexOf('email') == -1)
        return callback(new Error('Invalid Oauth Token'));
    callback(null,response.data.user_id);
  });
}


function formatUser(facebookUser) {
  return {
    id:facebookUser.id,
    username:`${facebookUser.first_name}${facebookUser.last_name}`,
    email:facebookUser.email.toLowerCase()
  };
}

const API = {
  getUser: (token,callback) => {
    verifyToken(token,(err,userID) => {
      if(err) return callback(err);
      FB.api('/me', {
        access_token: token,
        fields:['id','first_name','last_name','email','picture']
      }, (result) => {
        if(!result || result.error) return callback(new Error(result.error));
        return callback(null,formatUser(result));
      });
    });
  }
}

module.exports = API;
