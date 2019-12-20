'use strict';

const Nodal = require('nodal');
const bcrypt = require('bcryptjs');
const Cypher = Nodal.require('app/services/cypher.js');

class User extends Nodal.Model {

  beforeSave(callback) {

    if (!this.hasErrors() && !this.get('cypher')) {
      this.__safeSet__('cypher', Cypher.generate());
    }

    if (!this.hasErrors() && this.hasChanged('email')) {
      this.__safeSet__('email', this.get('email').toLowerCase());
    }

    if (!this.hasErrors() && this.hasChanged('password')) {

      bcrypt.hash(this.get('password'), 10, (err, hash) => {

        if (err) {
          return callback(new Error('Could not encrypt password'));
        }

        this.__safeSet__('password', hash);
        callback();

      });

    } else {

      callback();

    }

  }

  verifyPassword(unencrypted, callback) {

    bcrypt.compare(unencrypted, this.get('password'), (err, result) => {
      callback.call(this, err, result);
    });

  }

  format() {
    return this.toObject(['id','username','email']);
  }

}

User.setDatabase(Nodal.require('db/main.js'));
User.setSchema(Nodal.my.Schema.models.User);

User.validates('email', 'must be valid', v => v && (v + '').match(/.+@.+\.\w+/i));
User.validates('password', 'must be at least 5 characters in length', v => v && v.length >= 5);

User.calculates('has_password', (password) => {
  return password !== null;
});

User.hides('password');

module.exports = User;
