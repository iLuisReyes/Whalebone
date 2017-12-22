/* jshint esversion: 6 */

const request = require('request');

class Whalebone {
  // Create Whalebone instance with API URL
  constructor(url) {
    this.url = url;
  }

  // All methods below expect a callback function cb
  // Callback will be called with (error, response, body) arguments

  // Set token property and establish session
  authenticate(username, password, cb) {
    const self = this;
    request.post({
      url: this.url + '/api/authorization',
      json: { clientkey: username, passcode: password },
    }, function(err, resp, body) {
      if (resp.statusCode !== 200) {
        return cb(true, resp, body);
      }
      self.token = body.token;
      self.session = request.defaults({ auth: { bearer: self.token }, json: true });
      cb(err, resp, body);
    });
  }

  // Retrieve current conditions object
  getConditions(cb) {
    this.session.get({ url: this.url + '/api/filter/conditions' }, cb);
  }

  // Update the conditions on the server
  updateConditions(conditions, cb) {
    this.session.patch({
      url: this.url + '/api/filter/conditions',
      json: conditions,
    }, cb);
  }

  // Apply the filters, provide filtered response object
  evaluateContent(content, cb, opts={}) {
    this.session.post({
        url: this.url + '/api/filter',
        json: Object.assign({ source_text: content }, opts),
    }, cb);
  }

  // Send text user identifies as spam
  submitSpam(item_id, cb, opts={}) {
    this.session.post({
      url: this.url + '/api/filter/spam',
      json: Object.assign({ response_id: item_id }, opts),
    }, cb);
  }

  // Send text user identifies as not spam
  submitHam(item_id, cb, opts={}) {
    this.session.post({
      url: this.url + '/api/filter/ham',
      json: Object.assign({ response_id: item_id }, opts),
    }, cb);
  }

  // Methods below require Silver or higher license tier

  // Retrieve an array of content/text that were gated
  getGatedItems(cb, { offset=0, limit=0 }={}) {
    this.session.get({
      url: this.url + '/api/filter/gated',
      qs: { offset, limit },
    }, cb);
  }

  // Release an individual item of text/content from the gate
  releaseItem(item_id, cb) {
    this.session.put({ url: this.url + '/api/filter/gated/' + item_id }, cb);
  }

  // Permanently delete items in the gate
  clearGatedItems(cb) {
    this.session.delete({ url: this.url + '/api/filter/gated' }, cb);
  }

  // Retrieve an array of items released from the gate
  getReleasedItems(cb, { offset=0, limit=0, remove='n' }={}) {
    this.session.get({
      url: this.url + '/api/filter/gated/released',
      qs: { offset, limit, remove },
    }, cb);
  }

  // Permanently delete released items queue
  clearReleasedItems(cb) {
    this.session.delete({ url: this.url + '/api/filter/gated/released' }, cb);
  }
}

module.exports = Whalebone;
