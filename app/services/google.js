'use strict';

/*
 * Google Identity Verification
 * https://developers.google.com/identity/sign-in/web/backend-auth
 *
 */

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const clientID = process.env.GOOGLE_SERVER_CLIENT_ID;
const clientList = [
  process.env.GOOGLE_SERVER_CLIENT_ID,
  process.env.GOOGLE_WEB_CLIENT_ID
];

const client = new OAuth2Client(clientID);

async function verifyToken(id_token) {
  const login = await client.verifyIdToken({
    idToken: id_token,
    audience: clientList,
  });
  return login.getPayload();
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
    verifyToken(id_token)
      .then((user) => {
        if(access_token) return formatUser(access_token,callback);
        callback(null, {
          id:user.sub,
          username:`${profile.given_name}${profile.family_name}`,
          email:user.email.toLowerCase()
        });
      })
      .catch(() => callback(new Error('Invalid Oauth Token')));
  }
}

module.exports = API;
