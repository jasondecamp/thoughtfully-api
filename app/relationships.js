'use strict';

const Nodal = require('nodal');

const User = Nodal.require('app/models/user.js');
const AccessToken = Nodal.require('app/models/access_token.js');
const OauthUser = Nodal.require('app/models/oauth_user.js');
const Thought = Nodal.require('app/models/thought.js');

/* define all relationships */

AccessToken.joinsTo(User, {multiple: true});
OauthUser.joinsTo(User, {multiple:true});
Thought.joinsTo(User,{multiple:true});

module.exports = {}; // Don't need to export anything
