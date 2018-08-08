'use strict';

const Nodal = require('nodal');

class CreateOauthUsers extends Nodal.Migration {

  constructor(db) {
    super(db);
    this.id = 2018080720514250;
  }

  up() {

    return [
      this.createTable("oauth_users", [
        {"name":"user_id","type":"int"},
        {"name":"provider_id","type":"string"},
        {"name":"provider","type":"string"}
      ])
    ];

  }

  down() {

    return [
      this.dropTable("oauth_users")
    ];

  }

}

module.exports = CreateOauthUsers;
