"use strict";
const moment = require('moment');
const db = require('../cloudant');

function sendMessage(body, res) {
  let promise = new Promise(function callback(resolve, reject) {

    // creo un documento con la propiedad itHasAlreadyBeenRead en false
    // y con timestamp modificado segun parametro
    var document = {
      "message": body.message,
      "cellphoneNumber": body.cellphoneNumber,
      "timestamp": moment().add(body.offset, 'minutes'), // cambiar horas por minutos para pruebas
      "msgType": body.msgType,
      "hasBeenProcessed": false
    };

    db.insert(document, function callback(err, reply) {
      if (err) {
        console.error("Database error --> " + err);
        reject(new Error('Error'));
      } else if (reply) {
        console.log("Message stored --> " + JSON.stringify(reply.id));
        resolve({
          code: 200,
          msg: "Message stored --> " + JSON.stringify(reply.id)
        });
      }
    });
  });

  promise
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error))
};

module.exports = {
  sendMessage
};