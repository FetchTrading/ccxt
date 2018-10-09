const ccxt = require('./ccxt');
const erc = new ccxt.ercdex2();
erc.loadMarkets()
    .then(() => erc.fetchOrderBook('ZRX/WETH'));