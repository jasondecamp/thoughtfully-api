'use strict';

const Nodal = require('nodal');
const Thought = Nodal.require('app/models/thought.js');

const AuthController = Nodal.require('app/controllers/auth_controller.js');

class ThoughtsController extends AuthController {

  index() {

    this.authorize('user',(user) => {

      if(this.params.query.find) this.params.query.body__istartswith = decodeURIComponent(this.params.query.find);
      this.params.query.user_id = user.get('id'); // can only view own thoughts

      Thought.query()
        .where(this.params.query)
        .orderBy('body','ASC')
        .first((err, model) => {

          this.respond(model);

        });

    });

  }

  create() {

    this.authorize('user',(user) => {

      this.params.body.user_id = user.get('id'); // can only create own thoughts

      Thought.create(this.params.body, (err, model) => {

        user.set('last_active',model.get('created_at'));
        user.save();

        this.respond(err || model);

      });

    });

  }

}

module.exports = ThoughtsController;
