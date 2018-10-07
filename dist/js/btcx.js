"use strict";const e=require("./base/Exchange"),{ExchangeError:t}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"btcx",name:"BTCX",countries:["IS","US","EU"],rateLimit:1500,version:"v1",has:{CORS:!1},urls:{logo:"https://user-images.githubusercontent.com/1294454/27766385-9fdcc98c-5ed6-11e7-8f14-66d5e5cd47e6.jpg",api:"https://btc-x.is/api",www:"https://btc-x.is",doc:"https://btc-x.is/custom/api-document.html"},api:{public:{get:["depth/{id}/{limit}","ticker/{id}","trade/{id}/{limit}"]},private:{post:["balance","cancel","history","order","redeem","trade","withdraw"]}},markets:{"BTC/USD":{id:"btc/usd",symbol:"BTC/USD",base:"BTC",quote:"USD"},"BTC/EUR":{id:"btc/eur",symbol:"BTC/EUR",base:"BTC",quote:"EUR"}}})}async fetchBalance(e={}){let t=await this.privatePostBalance(),i={info:t},s=Object.keys(t);for(let e=0;e<s.length;e++){let a=s[e],r=a.toUpperCase(),o={free:t[a],used:0,total:t[a]};i[r]=o}return this.parseBalance(i)}async fetchOrderBook(e,t,i={}){let s={id:this.marketId(e)};void 0!==t&&(s.limit=t);let a=await this.publicGetDepthIdLimit(this.extend(s,i));return this.parseOrderBook(a,void 0,"bids","asks","price","amount")}async fetchTicker(e,t={}){let i=await this.publicGetTickerId(this.extend({id:this.marketId(e)},t)),s=1e3*i.time;return{symbol:e,timestamp:s,datetime:this.iso8601(s),high:this.safeFloat(i,"high"),low:this.safeFloat(i,"low"),bid:this.safeFloat(i,"sell"),ask:this.safeFloat(i,"buy"),vwap:void 0,open:void 0,close:void 0,first:void 0,last:this.safeFloat(i,"last"),change:void 0,percentage:void 0,average:void 0,baseVolume:void 0,quoteVolume:this.safeFloat(i,"volume"),info:i}}parseTrade(e,t){let i=1e3*parseInt(e.date),s="ask"===e.type?"sell":"buy";return{id:e.id,info:e,timestamp:i,datetime:this.iso8601(i),symbol:t.symbol,type:void 0,side:s,price:e.price,amount:e.amount}}async fetchTrades(e,t,i,s={}){let a=this.market(e),r=await this.publicGetTradeIdLimit(this.extend({id:a.id,limit:1e3},s));return this.parseTrades(r,a,t,i)}async createOrder(e,t,i,s,a,r={}){let o=await this.privatePostTrade(this.extend({type:i.toUpperCase(),market:this.marketId(e),amount:s,price:a},r));return{info:o,id:o.order.id}}async cancelOrder(e,t,i={}){return await this.privatePostCancel({order:e})}sign(e,t="public",i="GET",s={},a,r){let o=this.urls.api+"/"+this.version+"/";if("public"===t)o+=this.implodeParams(e,s);else{this.checkRequiredCredentials();let i=this.nonce();o+=t,r=this.urlencode(this.extend({Method:e.toUpperCase(),Nonce:i},s)),a={"Content-Type":"application/x-www-form-urlencoded",Key:this.apiKey,Signature:this.hmac(this.encode(r),this.encode(this.secret),"sha512")}}return{url:o,method:i,body:r,headers:a}}async request(e,i="public",s="GET",a={},r,o){let d=await this.fetch2(e,i,s,a,r,o);if("error"in d)throw new t(this.id+" "+this.json(d));return d}};
//# sourceMappingURL=btcx.js.map