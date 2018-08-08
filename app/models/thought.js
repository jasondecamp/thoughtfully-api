'use strict';

const Nodal = require('nodal');

class Thought extends Nodal.Model {}

Thought.setDatabase(Nodal.require('db/main.js'));
Thought.setSchema(Nodal.my.Schema.models.Thought);

module.exports = Thought;
