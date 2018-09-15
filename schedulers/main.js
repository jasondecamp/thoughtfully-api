'use strict';

const Nodal = require('nodal');
const scheduler = new Nodal.Scheduler();

/* generator: begin imports */

const EventProcessor = Nodal.require('tasks/eventProcessor.js');

/* generator: end imports */

/* generator: begin tasks */

scheduler.weekly(1).perform(EventProcessor);

/* generator: end tasks */


module.exports = scheduler;
