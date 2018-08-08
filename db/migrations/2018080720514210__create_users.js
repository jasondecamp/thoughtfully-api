'use strict';

const Nodal = require('nodal');

class CreateUsers extends Nodal.Migration {

  constructor(db) {
    super(db);
    this.id = 2018080720514210;
  }

  up() {

    return [
      this.createTable("users", [
        {"name":"username","type":"string"},
        {"name":"password","type":"string"},
        {"name":"email","type":"string","properties":{"unique":true}}
      ])
    ];

  }

  down() {

    return [
      this.dropTable("users")
    ];

  }

}

module.exports = CreateUsers;
