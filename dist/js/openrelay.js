"use strict";const e=require("./base/StandardRelayer");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"openrelay",name:"Open Relay",countries:"USA",version:void 0,userAgent:void 0,rateLimit:2e3,urls:{logo:"https://openrelay.xyz/img/profile.png",api:"https://api.openrelay.xyz/v0",www:"https://openrelay.xyz/",doc:["https://0xproject.com/docs/connect","https://openrelay.xyz/docs/"]},has:{createOrder:!1,createMarketOrder:!1,createLimitOrder:!1,fetchBalance:!1,fetchCurrencies:!0,fetchL2OrderBook:!1,fetchMarkets:!0,fetchOrderBook:!0,fetchTicker:!1,fetchTrades:!1,privateAPI:!1},perPage:99})}fetchCurrencies(){return this.listedCurrencies()}fetchMarkets(){return this.tokenPairs()}fetchOrderBook(e,r,t={}){return this.orderbook(e)}};
//# sourceMappingURL=openrelay.js.map