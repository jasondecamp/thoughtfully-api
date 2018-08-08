'use strict';

const Nodal = require('nodal');

const Events = Nodal.require('app/services/events.js');
const Mailgun = Nodal.require('app/services/mailgun.js');

const log = (err,result) => console.log(err || result);

class EventProcessor {

  exec(args) {

    console.log('Event Processor Execute: '+ new Date());

    Events.get((err, queue) => {
      if(err) return log(err);

      queue.forEach((event) => {
        Mailgun.send(event,log);
      });

    });

  }

}

module.exports = EventProcessor;
