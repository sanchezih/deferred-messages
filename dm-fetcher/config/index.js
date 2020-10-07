"use strict";

module.exports = {
  setConfig: env => {
    global.teco_config = require(`./config.${env}.json`);
  }
};
