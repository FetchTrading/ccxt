"use strict";const e=require("./base/Exchange"),{ExchangeError:t}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"therock",name:"TheRockTrading",countries:"MT",rateLimit:1e3,version:"v1",has:{CORS:!1,fetchTickers:!0},urls:{logo:"https://user-images.githubusercontent.com/1294454/27766869-75057fa2-5ee9-11e7-9a6f-13e641fa4707.jpg",api:"https://api.therocktrading.com",www:"https://therocktrading.com",doc:["https://api.therocktrading.com/doc/v1/index.html","https://api.therocktrading.com/doc/"]},api:{public:{get:["funds/{id}/orderbook","funds/{id}/ticker","funds/{id}/trades","funds/tickers"]},private:{get:["balances","balances/{id}","discounts","discounts/{id}","funds","funds/{id}","funds/{id}/trades","funds/{fund_id}/orders","funds/{fund_id}/orders/{id}","funds/{fund_id}/position_balances","funds/{fund_id}/positions","funds/{fund_id}/positions/{id}","transactions","transactions/{id}","withdraw_limits/{id}","withdraw_limits"],post:["atms/withdraw","funds/{fund_id}/orders"],delete:["funds/{fund_id}/orders/{id}","funds/{fund_id}/orders/remove_all"]}},fees:{trading:{maker:.002,taker:.002},funding:{tierBased:!1,percentage:!1,withdraw:{BTC:5e-4,BCH:5e-4,PPC:.02,ETH:.001,ZEC:.001,LTC:.002,EUR:2.5},deposit:{BTC:0,BCH:0,PPC:0,ETH:0,ZEC:0,LTC:0,EUR:0}}}})}async fetchMarkets(){let e=await this.publicGetFundsTickers(),t=[];for(let i=0;i<e.tickers.length;i++){let s=e.tickers[i],a=s.fund_id,r=a.slice(0,3),d=a.slice(3),n=r+"/"+d;t.push({id:a,symbol:n,base:r,quote:d,info:s})}return t}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privateGetBalances(),i=t.balances,s={info:t};for(let e=0;e<i.length;e++){let t=i[e],a=t.currency,r=t.trading_balance,d=t.balance,n={free:r,used:d-r,total:d};s[a]=n}return this.parseBalance(s)}async fetchOrderBook(e,t,i={}){await this.loadMarkets();let s=await this.publicGetFundsIdOrderbook(this.extend({id:this.marketId(e)},i)),a=this.parse8601(s.date);return this.parseOrderBook(s,a,"bids","asks","price","amount")}parseTicker(e,t){let i=this.parse8601(e.date),s=void 0;t&&(s=t.symbol);let a=this.safeFloat(e,"last");return{symbol:s,timestamp:i,datetime:this.iso8601(i),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"bid"),bidVolume:void 0,ask:this.safeFloat(e,"ask"),askVolume:void 0,vwap:void 0,open:this.safeFloat(e,"open"),close:a,last:a,previousClose:this.safeFloat(e,"close"),change:void 0,percentage:void 0,average:void 0,baseVolume:this.safeFloat(e,"volume_traded"),quoteVolume:this.safeFloat(e,"volume"),info:e}}async fetchTickers(e,t={}){await this.loadMarkets();let i=await this.publicGetFundsTickers(t),s=this.indexBy(i.tickers,"fund_id"),a=Object.keys(s),r={};for(let e=0;e<a.length;e++){let t=a[e],i=this.markets_by_id[t],d=i.symbol,n=s[t];r[d]=this.parseTicker(n,i)}return r}async fetchTicker(e,t={}){await this.loadMarkets();let i=this.market(e),s=await this.publicGetFundsIdTicker(this.extend({id:i.id},t));return this.parseTicker(s,i)}parseTrade(e,t){t||(t=this.markets_by_id[e.fund_id]);let i=this.parse8601(e.date);return{info:e,id:e.id.toString(),order:void 0,timestamp:i,datetime:this.iso8601(i),symbol:t.symbol,type:void 0,side:e.side,price:e.price,amount:e.amount}}async fetchTrades(e,t,i,s={}){await this.loadMarkets();let a=this.market(e),r=await this.publicGetFundsIdTrades(this.extend({id:a.id},s));return this.parseTrades(r.trades,a,t,i)}async createOrder(e,t,i,s,a,r={}){await this.loadMarkets(),"market"===t&&(a=0);let d=await this.privatePostFundsFundIdOrders(this.extend({fund_id:this.marketId(e),side:i,amount:s,price:a},r));return{info:d,id:d.id.toString()}}async cancelOrder(e,t,i={}){return await this.loadMarkets(),await this.privateDeleteFundsFundIdOrdersId(this.extend({id:e},i))}sign(e,t="public",i="GET",s={},a,r){let d=this.urls.api+"/"+this.version+"/"+this.implodeParams(e,s),n=this.omit(s,this.extractParams(e));if("private"===t){this.checkRequiredCredentials();let e=this.nonce().toString(),t=e+d;a={"X-TRT-KEY":this.apiKey,"X-TRT-NONCE":e,"X-TRT-SIGN":this.hmac(this.encode(t),this.encode(this.secret),"sha512")},Object.keys(n).length&&(r=this.json(n),a["Content-Type"]="application/json")}return{url:d,method:i,body:r,headers:a}}async request(e,i="public",s="GET",a={},r,d){let n=await this.fetch2(e,i,s,a,r,d);if("errors"in n)throw new t(this.id+" "+this.json(n));return n}};
//# sourceMappingURL=therock.js.map