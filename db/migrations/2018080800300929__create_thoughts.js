'use strict';

const Nodal = require('nodal');

class CreateThoughts extends Nodal.Migration {

  constructor(db) {
    super(db);
    this.id = 2018080800300929;
  }

  up() {

    return [
      this.createTable("thoughts", [{"name":"user_id","type":"int"},{"name":"body","type":"string"}])
    ];

  }

  down() {

    return [
      this.dropTable("thoughts")
    ];

  }

}

module.exports = CreateThoughts;
