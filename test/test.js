const request = require('supertest');
const app = require('../server');
const constant = require('../util/constant');

describe("healthCheck", () => {
  describe("detect that api is running service and able to handle requests", () => {
    it("should return ok", async () => {
      const res = await request(app).get('/market-status-api/health-check/');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('text/html'));
      expect(res.text).toEqual('ok');
    });
  });
});

describe('Market Status Endpoints ', () => {
  describe("Call api without pair", () => {
    it(`should return 404 because the pair is missing`, async () => {
      const res = await request(app).get('/market-status-api/tips/');
      expect(res.status).toEqual(404);
    });
  });

  describe("Call api without bad pair", () => {
    it(`should return 400 because the pair is invalid`, async () => {
      const res = await request(app).get('/market-status-api/tips/ERTC-RTY-EFF/');
      expect(res.status).toEqual(400);
    });
  });

  describe("pair_name=BTC-USD", () => {
    it(`should return best ask and best bid for BTC`, async () => {
      const res = await request(app).get('/market-status-api/tips/BTC-USD/');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res._body).toMatchObject({pair_name: 'BTCUSD'})
      expect(Object.keys(res._body))
        .toEqual(expect.arrayContaining(['pair_name', 'best_ask', 'best_bid']))
    });
  });

  describe("pair_name=ETH-USD", () => {
    it(`should return best ask and best bid for ETH`, async () => {
      const res = await request(app).get('/market-status-api/tips/ETH-USD/');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res._body).toMatchObject({pair_name: 'ETHUSD'})
      expect(Object.keys(res._body))
        .toEqual(expect.arrayContaining(['pair_name', 'best_ask', 'best_bid']))
    });
  });
  
  describe("handle unexpected pairs LTC-USD", () => {
    it(`should return best ask and best bid for LTC`, async () => {
      const res = await request(app).get('/market-status-api/tips/LTC-USD/');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res._body).toMatchObject({pair_name: 'LTCUSD'})
      expect(Object.keys(res._body))
        .toEqual(expect.arrayContaining(['pair_name', 'best_ask', 'best_bid']))
    });
  });  

  describe("test buy", () => {
    it(`should return price for buy`, async () => {

      const res = await request(app)
        .post('/market-status-api/operation/')
        .send({
          pair: 'BTC-USD',
          type: 'buy',
          amount: '0.01'
        });
      expect(res.status).toEqual(200);
      expect(Object.keys(res._body))
        .toEqual(expect.arrayContaining(
          ['pair', 'ask', 'bid', 'operation', 'amount', 'effective_price', 'total']
        ))
    });
  });

  describe("test sell", () => {
    it(`should return price for sell`, async () => {
      const res = await request(app)
        .post('/market-status-api/operation/')
        .send({
          pair: 'BTC-USD',
          type: 'sell',
          amount: '0.01'
        });
      expect(res.status).toEqual(200);
      expect(Object.keys(res._body))
        .toEqual(expect.arrayContaining(
          ['pair', 'ask', 'bid', 'operation', 'amount', 'effective_price', 'total']
        ))
    });
  });

});