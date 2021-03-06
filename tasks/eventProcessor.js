'use strict';
const moment = require('moment');
const Nodal = require('nodal');
const User = Nodal.require('app/models/user.js');
const Thought = Nodal.require('app/models/thought.js');
Nodal.require('app/relationships.js');

const Cypher = Nodal.require('app/services/cypher.js');
const Mailgun = Nodal.require('app/services/mailgun.js');

class EventProcessor {

  exec(args) {

    console.log('Event Processor Execute: '+ new Date());

    const limit = moment().subtract(7, 'days');
    User.query()
      .join('thoughts',[{'created_at__gt':limit.format()}])
      .where({'thoughts__created_at__gt':limit.format()})
      .end((err,users) => {
        if(err) return console.log(err);
        users.forEach((user) => {
          let counter = new Multiset();
          user.joined('thoughts').forEach(thought => {
            counter.add(thought.get('body'));
          });
          const sorted = [...counter.entries()]
            .map(item => ({body:Cypher.decrypt(item[0],user.get('cypher')),count:item[1]}))
            .sort((a, b) => b.count - a.count);
          if(sorted.length > 5) sorted.length = 5;
          const emailData = {
            email: 'thought-digest-weekly',
            user: user.toObject(),
            data: { thoughts: sorted }
          };
          Mailgun.send(emailData,(err,response) => console.log(err || response));
        });
      });

  }

}

class Multiset extends Map {
  constructor(...args) {
    super(...args);
  }
  add(elem) {
    if (!this.has(elem)) this.set(elem, 1);
    else this.set(elem, this.get(elem)+1);
  }
  remove(elem) {
    var count = this.has(elem) ? this.get(elem) : 0;
    if (count>1) this.set(elem, count-1);
    else if (count==1) this.delete(elem);
  }
}

// can trigger event processor manually
// $ node tasks/eventProcessor.js manual
if(process.argv[2] && process.argv[2] == 'manual')
  (new EventProcessor()).exec();

module.exports = EventProcessor;
