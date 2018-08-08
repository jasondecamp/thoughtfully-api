'use strict';

const Nodal = require('nodal');
const Redis = Nodal.require('app/services/redis.js');
require('datejs');

const Events = {
  add: (event,callback) => {
    // get the existing queue
    Redis.get('emailQueue', (err,response) => {

      if(err && callback) callback(err);

      const queue = response ? JSON.parse(response) : [];

      // add new event to the queue
      queue.push(event);

      // save the updated queue
      Redis.set('eventQueue', JSON.stringify(queue));

      if(callback) callback(null, queue);

    });
  },
  get: (callback) => {
    Redis.get('emailQueue', (err,response) => {

      if(err && callback) callback(err);

      const queue = response ? JSON.parse(response) : [];

      // save the updated queue
      Redis.set('eventQueue', false);

      // respond with the active queue
      if(callback) callback(null, queue);

    });
  }
};

module.exports = Events;
