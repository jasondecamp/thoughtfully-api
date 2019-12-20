/*
 *  App Migrations from version to version
 *
 *  To use:
 *  node tasks/migrate.js [migration name]
 *
 */
'use strict';

const async = require('async');

const Nodal = require('nodal');
const User = Nodal.require('app/models/user.js');
const Thought = Nodal.require('app/models/thought.js');

const Relationships = Nodal.require('app/relationships.js');

const Cypher = Nodal.require('app/services/cypher.js');

let migrations = {};

migrations.cypher = () => {
  User.query()
    .end((err,users) => {
      if(err) return console.log(err);

      async.eachSeries(users,
        (user,userCallback) => {
          if(!user.get('cypher')) {
            user.set('cypher',Cypher.generate());
            user.save(() => {
              console.log(`CYPHER SET: ${user.get('username')}`);
              Thought.query()
                .where({user_id:user.get('id')})
                .end((err,thoughts) => {
                  async.eachSeries(thoughts,
                    (thought,thoughtCallback) => {
                      console.log(`THOUGHT ENCRYPTED: ${user.get('username')}`);
                      thought.set('body',Cypher.encrypt(thought.get('body'),user.get('cypher')));
                      thought.save(thoughtCallback);
                    }, (err) => {
                      console.log(`COMPELTE: ${user.get('username')}`);
                      userCallback(err)
                    });
                });
            });
          } else {
            console.log(`SKIP: ${user.get('username')}`);
            userCallback();
          }
        }, err => {
          console.log(err || '---COMPLETE CYPHER MIGRATION---');
          process.exit();
        });

    });
};

process.argv.forEach((val,index) => {
  if(index < 2) return;
  if(migrations.hasOwnProperty(val)) migrations[val]();
});
