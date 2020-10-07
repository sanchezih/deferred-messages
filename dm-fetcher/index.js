"use strict";
const teco_config = require('./env');
require('./config/').setConfig(teco_config.TECO_NODE_ENV);

const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controllers/message.controller');
const pkg = require('./package.json');
const app = express();
const port = process.env.PORT || 5002;

app.use(bodyParser.json());

app.listen(port, () => {
    console.info(`${pkg.name} is online`);
    console.info(`listening on port ${port}`);
    console.info('environment: ' + process.env.DEPLOYMENT_ENVIRONMENT);
});

// endpoints
app.get("/healthz", function (request, response) {
    response.send('ok');
});

app.post("/readMessages", function (req, res, next) {
    controller.readMessages(res);
});

app.post("/deleteMessages", function (req, res, next) {
    controller.deleteMessages(req.body, res);
});