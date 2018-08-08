'use strict';

const Nodal = require('nodal');

const User = Nodal.require('app/models/user.js');
const Relationships = Nodal.require('app/relationships.js');

const AuthController = Nodal.require('app/controllers/auth_controller.js');
class UsersController extends AuthController {

  index() {

    this.authorize('user',(user) => {

      // movers can only query their own data
      if(this.params.query.id && user.get('id') != this.params.query.id)
        return this.respond(new Error('User not authorized'));
      if(!this.params.query.id) this.params.query.id == user.get('id');

      User.query()
        .where(this.params.query)
        .end((err, models) => {

          if(err) return this.respond(err);

          let formatted = new Nodal.ItemArray();

          models.forEach((model) => {
            formatted.push(model.format(user));
          });

          formatted.setMeta(models._meta);
          this.respond(formatted);

        });

    });

  }

  show() {

    this.authorize('user',(user) => {

      if(this.params.route.id == 'me')
        this.params.route.id = user.get('id');

      if(user.get('id') != this.params.route.id)
        return this.respond(new Error('User not authorized'));

      User.query()
        .where({id:this.params.route.id})
        .first((err, model) => {

          this.respond(err || model.format(user));

        });

    });

  }

  create() {

    this.authorize('public',(user) => {

      if(user) return this.respond(new Error('already signed in'));

      if(!this.params.body.password) return this.respond(new Error('password is required'));

      User.create(this.params, (err,result) => {

        this.respond(err || result.format(user));

      });

    });

  }

  update() {

    this.authorize('user',(user) => {

      if(user.get('id') != this.params.route.id)
        return this.respond(new Error('User not authorized'));

      // if updating password, require and verify old password
      if(this.params.body.password)
        return user.verifyPassword(this.params.body.old_password, (err, result) => {

          if (err || !result) return this.respond(new Error('Invalid credentials'));

          User.update(this.params.route.id, this.params.body, (err, model) => {

            this.respond(err || model.format(user));

          });

        });

      User.update(this.params.route.id, this.params.body, (err, model) => {

        this.respond(err || model.format(user));

      });

    });

  }

}

module.exports = UsersController;
