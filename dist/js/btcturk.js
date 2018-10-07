"use strict";const e=require("./base/Exchange"),{ExchangeError:t}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"btcturk",name:"BTCTurk",countries:"TR",rateLimit:1e3,has:{CORS:!0,fetchTickers:!0,fetchOHLCV:!0},timeframes:{"1d":"1d"},urls:{logo:"https://user-images.githubusercontent.com/1294454/27992709-18e15646-64a3-11e7-9fa2-b0950ec7712f.jpg",api:"https://www.btcturk.com/api",www:"https://www.btcturk.com",doc:"https://github.com/BTCTrader/broker-api-docs"},api:{public:{get:["ohlcdata","orderbook","ticker","trades"]},private:{get:["balance","openOrders","userTransactions"],post:["exchange","cancelOrder"]}},markets:{"BTC/TRY":{id:"BTCTRY",symbol:"BTC/TRY",base:"BTC",quote:"TRY",baseId:"btc",quoteId:"try",maker:.00236,taker:.00413},"ETH/TRY":{id:"ETHTRY",symbol:"ETH/TRY",base:"ETH",quote:"TRY",baseId:"eth",quoteId:"try",maker:.00236,taker:.00413},"XRP/TRY":{id:"XRPTRY",symbol:"XRP/TRY",base:"XRP",quote:"TRY",baseId:"xrp",quoteId:"try",maker:.00236,taker:.00413},"ETH/BTC":{id:"ETHBTC",symbol:"ETH/BTC",base:"ETH",quote:"BTC",baseId:"eth",quoteId:"btc",maker:.00236,taker:.00413}}})}async fetchBalance(e={}){let t=await this.privateGetBalance(),a={info:t},i=Object.keys(this.currencies);for(let e=0;e<i.length;e++){let s=i[e],r=this.currencies[s],o=this.account(),d=r.id+"_available",h=r.id+"_balance",c=r.id+"_reserved";d in t&&(o.free=this.safeFloat(t,d),o.total=this.safeFloat(t,h),o.used=this.safeFloat(t,c)),a[s]=o}return this.parseBalance(a)}async fetchOrderBook(e,t,a={}){let i=this.market(e),s=await this.publicGetOrderbook(this.extend({pairSymbol:i.id},a)),r=parseInt(1e3*s.timestamp);return this.parseOrderBook(s,r)}parseTicker(e,t){let a=void 0;t&&(a=t.symbol);let i=1e3*parseInt(e.timestamp),s=this.safeFloat(e,"last");return{symbol:a,timestamp:i,datetime:this.iso8601(i),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"bid"),bidVolume:void 0,ask:this.safeFloat(e,"ask"),askVolume:void 0,vwap:void 0,open:this.safeFloat(e,"open"),close:s,last:s,previousClose:void 0,change:void 0,percentage:void 0,average:this.safeFloat(e,"average"),baseVolume:this.safeFloat(e,"volume"),quoteVolume:void 0,info:e}}async fetchTickers(e,t={}){await this.loadMarkets();let a=await this.publicGetTicker(t),i={};for(let e=0;e<a.length;e++){let t=a[e],s=t.pair,r=void 0;s in this.markets_by_id&&(s=(r=this.markets_by_id[s]).symbol),i[s]=this.parseTicker(t,r)}return i}async fetchTicker(e,t={}){await this.loadMarkets();let a=await this.fetchTickers(),i=void 0;return e in a&&(i=a[e]),i}parseTrade(e,t){let a=1e3*e.date;return{id:e.tid,info:e,timestamp:a,datetime:this.iso8601(a),symbol:t.symbol,type:void 0,side:void 0,price:e.price,amount:e.amount}}async fetchTrades(e,t,a,i={}){let s=this.market(e),r=await this.publicGetTrades(this.extend({pairSymbol:s.id},i));return this.parseTrades(r,s,t,a)}parseOHLCV(e,t,a="1d",i,s){return[this.parse8601(e.Time),e.Open,e.High,e.Low,e.Close,e.Volume]}async fetchOHLCV(e,t="1d",a,i,s={}){await this.loadMarkets();let r=this.market(e),o={};void 0!==i&&(o.last=i);let d=await this.publicGetOhlcdata(this.extend(o,s));return this.parseOHLCVs(d,r,t,a,i)}async createOrder(e,a,i,s,r,o={}){await this.loadMarkets();let d={PairSymbol:this.marketId(e),OrderType:"buy"===i?0:1,OrderMethod:"market"===a?1:0};if("market"===a){if(!("Total"in o))throw new t(this.id+' createOrder requires the "Total" extra parameter for market orders (amount and price are both ignored)')}else d.Price=r,d.Amount=s;let h=await this.privatePostExchange(this.extend(d,o));return{info:h,id:h.id}}async cancelOrder(e,t,a={}){return await this.privatePostCancelOrder({id:e})}nonce(){return this.milliseconds()}sign(e,a="public",i="GET",s={},r,o){if("btctrader"===this.id)throw new t(this.id+" is an abstract base API for BTCExchange, BTCTurk");let d=this.urls.api+"/"+e;if("public"===a)Object.keys(s).length&&(d+="?"+this.urlencode(s));else{this.checkRequiredCredentials();let e=this.nonce().toString();o=this.urlencode(s);let t=this.base64ToBinary(this.secret),a=this.apiKey+e;r={"X-PCK":this.apiKey,"X-Stamp":e,"X-Signature":this.stringToBase64(this.hmac(this.encode(a),t,"sha256","binary")),"Content-Type":"application/x-www-form-urlencoded"}}return{url:d,method:i,body:o,headers:r}}};
//# sourceMappingURL=btcturk.js.map