"use strict";const e=require("../base/StandardRelayer");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"bamboorelay",name:"Bamboo Relay",countries:"USA",version:void 0,userAgent:void 0,rateLimit:1e3,urls:{logo:"https://sra.bamboorelay.com/logo-stacked.svg",api:"https://sra.bamboorelay.com/main/v0/",www:"https://bamboorelay.com/",doc:["https://0xproject.com/docs/connect","https://sra.bamboorelay.com/"]},has:{createOrder:!1,createMarketOrder:!1,createLimitOrder:!1,fetchBalance:!1,fetchCurrencies:!0,fetchL2OrderBook:!1,fetchMarkets:!0,fetchOrderBook:!0,fetchTicker:!0,fetchTrades:!1,privateAPI:!1},perPage:99})}fetchCurrencies(){return this.listedCurrencies()}fetchMarkets(){return this.tokenPairs()}fetchOrderBook(e,r,t={}){return this.orderbook(e)}fetchTicker(e,r={}){return this.ticker(e)}};
//# sourceMappingURL=bamboorelay.js.map