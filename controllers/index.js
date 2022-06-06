const axios = require('axios')
const constant = require('../util/constant');
const helpers  = require('../util/helpers');

const healthCheck = async (req, res) => {
    try {
      return res.status(200).send('ok');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

const getTips = async (req, res) => {
  helpers.validateTips(req, res)
};

const buySell = async (req, res) => {
  helpers.validateBuySell(req, res)
};

module.exports = {
  healthCheck,
  getTips,
  buySell
};