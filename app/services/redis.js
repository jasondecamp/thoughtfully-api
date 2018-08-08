'use strict';

const redis = require('redis');

module.exports = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
