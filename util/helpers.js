const axios = require('axios')
const constant = require('../util/constant');

const validatePair = async (req, res) => {
  let requestMethod = req.method, pair = "";
  if (requestMethod == "GET")
    pair = req.params.pair
  else if (requestMethod == "POST")
    pair = req.body.pair
    
  if (pair.toString().startsWith("-") || pair.toString().endsWith("-"))
    res.status(400).send("Invalid pair");
  return pair.replace("-","")
};
const axiosBitfinexApiCall = async (symbol) => {
  const pathParams = `book/t${symbol}/P0`;
  return axios.get(`${constant.URL_API_PUB_BITFINEX}/${pathParams}?${constant.QUERY_PARAMS}`)
};

const validateTips = async (req, res) => {
  try {
    const symbol = await validatePair(req, res)
    const tips = await axiosBitfinexApiCall(symbol)

    let orderBook = tips.data;
    let len = orderBook.length;
    const responseBody = {
        'pair_name': symbol,
        'best_bid': orderBook[0],
        'best_ask': orderBook[parseInt(len/2)]
    }
    res.status(200).json(responseBody);         
  } catch (error) {
    //res.status(500).send(error.message);
    res.status(400).send(error.response.data);
  }
};

const validateBuySell = async (req, res) => {
  try {
      const {type, amount } = req.body;
      const symbol = await validatePair(req, res)
      const tips = await axiosBitfinexApiCall(symbol)
      
      let orderBook = tips.data;
      let len = orderBook.length;

      let best_bid = orderBook[0] //valor de compra
      let best_ask = orderBook[parseInt(len/2)] //valor de venta

      let effective_price = 0, total = 0
      if (type == "buy"){
        effective_price = best_ask[0] 
        total = amount * effective_price
      }else if (type == "sell"){
        effective_price = best_bid[0]
        total = amount * effective_price
      }
      
      const responseBody = {
        'pair': symbol,
        'ask': best_ask[0],
        'bid': best_bid[0],
        'operation': type,
        'amount': amount,
        'effective_price': effective_price,
        'total': total.toFixed(2)
      }
      res.status(200).json(responseBody);         
      
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  validateTips,
  validateBuySell
};