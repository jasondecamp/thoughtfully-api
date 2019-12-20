'use strict';

const Nodal = require('nodal');

class AddCypherUsers extends Nodal.Migration {

  constructor(db) {
    super(db);
    this.id = 2019121922274100;
  }

  up() {

    return [
      this.addColumn('users','cypher','string'),
    ];

  }

  down() {

    return [
      this.dropColumn('users','cypher'),
    ];

  }

}

module.exports = AddCypherUsers;
