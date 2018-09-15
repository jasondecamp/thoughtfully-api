'use strict';

// dependencies
const _ = require('lodash');
const path = require('path');
const Email = require('email-templates');
const cons = require('consolidate');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');

/* Allow custom configuration additions (functions and filters) */
cons.requires.nunjucks = nunjucks.configure();

/* Add custom functions */
/*
cons.requires.nunjucks.addGlobal('findTaskDate', (name,moveTask) => {
  return moveTask.move_task_dates && moveTask.move_task_dates.length ?
    moveTask.move_task_dates.find((date) => date.name == name) : {};
});
*/

/* Add custom formatters */
cons.requires.nunjucks.addFilter('date', dateFilter);
/*
cons.requires.nunjucks.addFilter('fullname', (customer) => {
  if (!customer) { return ''; }
  return customer.firstname + ' ' + customer.lastname;
});
*/

// mailgun initiation
const mailgun = require('mailgun-js')({
  apiKey:process.env.MAILGUN_KEY,
  domain:process.env.MAILGUN_DOMAIN
});

const defaultRenderData = {
  domain: process.env.ENV_DOMAIN,
  currentYear: new Date().getFullYear()
};

const defaultSendData = {
  from: 'Thoughtfully <me@thoughtfully.app>'
}

const formatEmail = (user) => {
  return user.username ? `${user.username} <${user.email}>` : user.email;
}


const Mailgun = {
  send: (data,callback) => {
    /*
    data: {
      email: 'example-email'
      options: {
        to: 'Other <other @mail.com>'
        from: 'Other <other @mail.com>'
        subject: 'my subject override'
        html: '<div>html override</div>'
      }
      user: user.toObject() result
      data: { custom data for the email template }
    }
    */
    // format the data
    data.data = data.data || {};
    if(data.user) data.data.user = data.user;

    // get the template
    const template = new Email({
      views: { options: { extension: 'njk' } }
    });
    // render the template with the data
    const renderData = _.extend({}, defaultRenderData, data.data);
    template.renderAll(data.email, renderData).then((result) => {
      // construct the data to send the email
      const defaultTo = data.user ? { to: formatEmail(data.user) } : {};
      const sendData = _.extend({},result,defaultSendData,defaultTo,data.options);
      // send the email
      mailgun.messages().send(sendData, callback);
    }).catch(console.error);
  }
};

module.exports = Mailgun
