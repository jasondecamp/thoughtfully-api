'use strict';

const Nodal = require('nodal');
const Thought = Nodal.require('app/models/thought.js');
const Cypher = Nodal.require('app/services/cypher.js');

const AuthController = Nodal.require('app/controllers/auth_controller.js');

class ThoughtsController extends AuthController {

  index() {

    this.authorize('user',(user) => {
      if(this.params.query.find) {
        this.params.query.body__startswith = Cypher.encrypt(this.params.query.find,user.get('cypher'));
        delete this.params.query.find;
      }
      if(this.params.query.body) this.params.query.body = Cypher.encrypt(this.params.query.body,user.get('cypher'));
      this.params.query.user_id = user.get('id'); // can only view own thoughts

      Thought.query()
        .where(this.params.query)
        .orderBy('body','ASC')
        .first((err, model) => {

          if(model) model.set('body',Cypher.decrypt(model.get('body'),user.get('cypher')));
          this.respond(model);

        });

    });

  }

  create() {

    this.authorize('user',(user) => {

      this.params.body.user_id = user.get('id'); // can only create own thoughts
      this.params.body.body = Cypher.encrypt(this.params.body.body.trim(),user.get('cypher'));

      Thought.create(this.params.body, (err, model) => {

        user.set('last_active',model.get('created_at'));
        user.save();

        this.respond(err || model);

      });

    });

  }

}

module.exports = ThoughtsController;
