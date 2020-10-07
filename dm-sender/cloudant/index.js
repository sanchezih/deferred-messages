"use strict";
const Cloudant = require('@cloudant/cloudant');
const utils = require('../utils/util');
const config = utils.getGlobals();

var connection;

function connect(callback) {
  if (connection) {
    return callback(null, connection);
  }

  Cloudant({ url: config.cloudant.url, plugins: { iamauth: { iamApiKey: config.cloudant.iamApiKey } } }, function (err, client) {
    if (err) {
      return callback(err);
    }
    connection = client;
    return callback(null, connection);
  })
}

function insert(document, callback) {
  connect(function (err, client) {
    if (err) {
      return callback(err);
    }
    let db = client.db.use(config.cloudant.dbName);
    db.insert(document, function (err, body) {
      return callback(err, body);
    })
  })
}

module.exports = {
  insert
};