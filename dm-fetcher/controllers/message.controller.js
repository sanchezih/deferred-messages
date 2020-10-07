"use strict";
const db = require('../cloudant');
const moment = require('moment');

var doc = {};

function destroyMsg(doc) {
  db.destroy(doc._id, doc._rev, function callback(err, reply) {
    if (err) {
      console.error("Database error --> " + err);
    } else if (reply) {
      console.info("Message destroyed --> " + JSON.stringify(reply));
    }
  });
}

function updateData() {
  db.insert(doc, function callback(err, reply) {
    if (err) {
      console.error("Database error --> " + err);
    } else if (reply) {
      console.info("Message updated --> " + JSON.stringify(reply));
    }
  });
}

function readMessages(res) {
  let promise = new Promise(function (resolve, reject) {

    // filtro mensajes de tipo "deferredMessage" cuyo timestamp
    // sea <= menor a la hora actual
    var query = {
      "selector": {
        "timestamp": { "$lt": moment() },
        "msgType": { "$eq": "deferredMessage" },
        "hasBeenProcessed": { "$eq": false }
      }
    };
    db.find(query, function findCallback(err, reply) {
      if (err) {
        console.error("Database error --> " + err);
        reject({
          code: err,
          msg: "Database error --> " + err
        });
      } else if (reply) {
        for (var k in reply.docs) {
          doc = reply.docs[k];
          doc.hasBeenProcessed = true; // actualizo la propiedad en todos los docs
          updateData();
        }
        resolve({
          code: 200,
          msg: Object.keys(reply.docs).length + " documents has been updated"
        });
      } else {
        resolve({
          code: 200,
          msg: "ok"
        });
      }
    });
  });

  promise
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error))
};


function deleteMessages(body, res) {
  let promise = new Promise(function (resolve, reject) {

    var query = {
      "selector": {
        "cellphoneNumber": body.cellphoneNumber,
        "hasBeenProcessed": { "$eq": false }
      }
    };
    db.find(query, function findCallback(err, reply) {
      if (err) {
        console.error("Database error --> " + err);
        reject({
          code: err,
          msg: "Database error --> " + err
        });
      } else if (reply) {
        for (var k in reply.docs) {
          doc = reply.docs[k];
          destroyMsg(doc);
        }
        resolve({
          code: 200,
          msg: Object.keys(reply.docs).length + " documents has been destroyed"
        });
      } else {
        resolve({
          code: 200,
          msg: "ok"
        });
      }
    });
  });
  promise
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error))
};

module.exports = {
  readMessages, deleteMessages
};