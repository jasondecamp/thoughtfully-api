'use strict';

const Nodal = require('nodal');
const OauthUser = Nodal.require('app/models/oauth_user.js');
const User = Nodal.require('app/models/user.js');
const AccessToken = Nodal.require('app/models/access_token.js');

const Relationships = Nodal.require('app/relationships.js');

const AuthController = Nodal.require('app/controllers/auth_controller.js');
class OauthUsersController extends AuthController {

  create() {

    this.authorize('public',(user) => {

      if(!this.params.body.oauth_token) return this.respond(new Error('`oauth_token` required'));
      if(!this.params.body.provider) return this.respond(new Error('`provider` required'));

      OauthUser.getUserFromProvider(this.params.body, (err,account) => {
        if(err) return this.respond(err);
        // if logged in
        if(user) {
          // lookup existing oauth users by id & provider
          OauthUser.query()
            .where({provider_id:account.id,provider:this.params.body.provider})
            .join('user')
            .first((err,oauth) => {
              // if no match tether
              if(err || !oauth) {
                // create oauth
                OauthUser.create({
                  user_id:user.get('id'),
                  provider_id:account.id,
                  provider:this.params.body.provider
                }, (err,oauthUser) => {
                  return this.respond(err || oauthUser);
                });
              // if match is self, error already connected
              } else if(user.get('id') == oauth.get('user_id')) {
                return this.respond(new Error('already connected'));
              // if match is not self, error connected to different user
              } else {
                return this.respond(new Error('account connected to a different user'));
              }
            });
        // if not logged in
        } else {
          // lookup existing oauth users by id & provider
          OauthUser.query()
            .where({provider_id:account.id,provider:this.params.body.provider})
            .join('user')
            .first((err,oauth) => {
              // if match, login
              if(oauth) return AccessToken.generate({user:oauth.joined('user'),type:'bearer'}, (err,accessToken) => {
                return this.respond(err || accessToken.format());
              });
              // if no match lookup existing user by email
              else User.query()
                .where({email:account.email.toLowerCase()})
                .first((err,user) => {
                  // if no match create new user
                  if(err || !user) {
                    this.params.body.login = true;
                    this.params.body.email = account.email.toLowerCase();
                    this.params.body.username = account.username;
                    return User.create(this.params, (err,user) => {
                      if(err) return this.respond(err);
                      OauthUser.create({
                        user_id: user.get('id'),
                        provider_id: account.id,
                        provider: this.params.body.provider
                      }, (err,oauthUser) => {
                        AccessToken.generate({user:user,type:'bearer'}, (err,accessToken) => {
                          return this.respond(err || accessToken.format(true));
                        });
                      });
                    });
                  // if match tether and login
                  } else OauthUser.create({
                    user_id:user.get('id'),
                    provider_id:account.id,
                    provider:this.params.body.provider
                  }, (err,oauthUser) => {
                    AccessToken.generate({user:user,type:'bearer'}, (err,accessToken) => {
                      return this.respond(err || accessToken.format());
                    });
                  });

                });
            });
        }
      });

    });

  }

  destroy() {

    this.authorize('user',(user) => {

      OauthUser.query()
        .where({provider:this.params.provider, user_id:user.get('id')})
        .first((err,model) => {

          if(err) return this.respond(err);

          OauthUser.destroy(model.get('id'), (err) => {

            this.respond(err || {'msg':'success'});

          });


        });

    });

  }

}

module.exports = OauthUsersController;
