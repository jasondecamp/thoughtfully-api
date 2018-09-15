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
        {"name":"username","type":"string","properties":{"unique":true}},
        {"name":"password","type":"string"},
        {"name":"email","type":"string","properties":{"unique":true}},
        {"name":"last_active","type":"datetime"}
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
