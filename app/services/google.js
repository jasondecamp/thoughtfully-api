'use strict';

/*
 * Google Identity Verification
 * https://developers.google.com/identity/sign-in/web/backend-auth
 *
 */

const google = require('googleapis');
const GoogleAuth = require('google-auth-library');

const clientID = process.env.GOOGLE_SERVER_CLIENT_ID;
const clientList = [
  process.env.GOOGLE_WEB_CLIENT_ID
];
const auth = new GoogleAuth;
const client = new auth.OAuth2(clientID,'','');

function verifyToken(id_token,callback) {
  client.verifyIdToken(id_token,clientList,(err,login) => {
    if(err) return callback(new Error('Invalid Oauth Token'));
    return callback(null,login.getPayload());
  });
}

const oauth2 = google.oauth2('v2');
function formatUser(access_token,callback) {
  oauth2.userinfo.get({access_token:access_token},(err,profile) => {
    callback(err,{
      id:profile.id,
      username:`${profile.given_name}${profile.family_name}`,
      email:profile.email.toLowerCase()
    });
  });
}

const API = {
  getUser: (id_token,access_token,callback) => {
    verifyToken(id_token,(err,user) => {
      if(err) return callback(err);
      if(access_token) return formatUser(access_token,callback);
      callback(null, {
        id:user.sub,
        username:`${profile.given_name}${profile.family_name}`,
        email:user.email.toLowerCase()
      });
    });
  }
}

module.exports = API;
