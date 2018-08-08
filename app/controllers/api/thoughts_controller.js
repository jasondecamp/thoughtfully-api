'use strict';

const Nodal = require('nodal');
const Thought = Nodal.require('app/models/thought.js');

class ThoughtsController extends Nodal.Controller {

  index() {

    this.authorize('user',(user) => {

      if(this.params.query.find) this.params.query.body__istartswith = decodeURIComponent(this.params.query.find);
      this.params.query.user_id = user.get('id'); // can only view own thoughts

      Thought.query()
        .where(this.params.query)
        .orderBy('body','ASC')
        .end((err, models) => {

          this.respond(err || models);

        });

    });

  }

  create() {

    this.authorize('user',(user) => {

      this.params.body.user_id = user.get('id'); // can only create own thoughts

      Thought.create(this.params.body, (err, model) => {

        this.respond(err || model);

      });

    });

  }

}

module.exports = ThoughtsController;
