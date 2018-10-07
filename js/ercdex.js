'use strict';

const StandardRelayerV2 = require('./base/StandardRelayerV2');

module.exports = class ercdex extends StandardRelayerV2 {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'ercdex2',
            'name': 'ERC dEX',
            'countries': 'USA',
            'version': undefined,
            'userAgent': undefined,
            'rateLimit': 1000,
            'urls': {
                'logo': 'https://pbs.twimg.com/profile_images/941139790916861953/Q7GLIM7D_400x400.jpg',
                'api': 'https://app.ercdex.com/api/v2',
                'www': 'https://ercdex.com',
                'doc': [
                    'https://0xproject.com/docs/connect',
                    'https://aqueduct.ercdex.com/rest.html',
                ],
            },
            'has': {
                'createOrder': false,
                'createMarketOrder': false,
                'createLimitOrder': false,
                'fetchBalance': false,
                'fetchCurrencies': true,
                'fetchL2OrderBook': false,
                'fetchMarkets': true,
                'fetchOrderBook': true,
                'fetchTicker': false,
                'fetchTrades': false,
                'privateAPI': false,
            },
            'perPage': 99,
        });
    }

};
