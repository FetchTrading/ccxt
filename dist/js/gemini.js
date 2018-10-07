"use strict";const e=require("./base/Exchange"),{ExchangeError:t}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"gemini",name:"Gemini",countries:"US",rateLimit:1500,version:"v1",has:{fetchDepositAddress:!1,createDepositAddress:!0,CORS:!1,fetchBidsAsks:!1,fetchTickers:!1,fetchMyTrades:!0,fetchOrder:!1,fetchOrders:!1,fetchOpenOrders:!1,fetchClosedOrders:!1,withdraw:!0},urls:{logo:"https://user-images.githubusercontent.com/1294454/27816857-ce7be644-6096-11e7-82d6-3c257263229c.jpg",api:"https://api.gemini.com",www:"https://gemini.com",doc:["https://docs.gemini.com/rest-api","https://docs.sandbox.gemini.com"],test:"https://api.sandbox.gemini.com",fees:["https://gemini.com/fee-schedule/","https://gemini.com/transfer-fees/"]},api:{public:{get:["symbols","pubticker/{symbol}","book/{symbol}","trades/{symbol}","auction/{symbol}","auction/{symbol}/history"]},private:{post:["order/new","order/cancel","order/cancel/session","order/cancel/all","order/status","orders","mytrades","tradevolume","balances","deposit/{currency}/newAddress","withdraw/{currency}","heartbeat"]}},fees:{trading:{taker:.0025,maker:.0025}}})}async fetchMarkets(){let e=await this.publicGetSymbols(),t=[];for(let s=0;s<e.length;s++){let i=e[s],r=i,a=r.toUpperCase(),o=a.slice(0,3),d=a.slice(3,6),n=o+"/"+d;t.push({id:i,symbol:n,base:o,quote:d,info:r})}return t}async fetchOrderBook(e,t,s={}){await this.loadMarkets();let i=await this.publicGetBookSymbol(this.extend({symbol:this.marketId(e)},s));return this.parseOrderBook(i,void 0,"bids","asks","price","amount")}async fetchTicker(e,t={}){await this.loadMarkets();let s=this.market(e),i=await this.publicGetPubtickerSymbol(this.extend({symbol:s.id},t)),r=i.volume.timestamp,a=s.base,o=s.quote,d=this.safeFloat(i,"last");return{symbol:e,timestamp:r,datetime:this.iso8601(r),high:void 0,low:void 0,bid:this.safeFloat(i,"bid"),bidVolume:void 0,ask:this.safeFloat(i,"ask"),askVolume:void 0,vwap:void 0,open:void 0,close:d,last:d,previousClose:void 0,change:void 0,percentage:void 0,average:void 0,baseVolume:parseFloat(i.volume[a]),quoteVolume:parseFloat(i.volume[o]),info:i}}parseTrade(e,t){let s=e.timestampms,i=void 0;"order_id"in e&&(i=e.order_id.toString());let r=this.safeFloat(e,"fee_amount");if(void 0!==r){let t=this.safeString(e,"fee_currency");void 0!==t&&(t in this.currencies_by_id&&(t=this.currencies_by_id[t].code),t=this.commonCurrencyCode(t)),r={cost:this.safeFloat(e,"fee_amount"),currency:t}}let a=this.safeFloat(e,"price"),o=this.safeFloat(e,"amount");return{id:e.tid.toString(),order:i,info:e,timestamp:s,datetime:this.iso8601(s),symbol:t.symbol,type:void 0,side:e.type,price:a,cost:a*o,amount:o,fee:r}}async fetchTrades(e,t,s,i={}){await this.loadMarkets();let r=this.market(e),a=await this.publicGetTradesSymbol(this.extend({symbol:r.id},i));return this.parseTrades(a,r,t,s)}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privatePostBalances(),s={info:t};for(let e=0;e<t.length;e++){let i=t[e],r=i.currency,a={free:parseFloat(i.available),used:0,total:parseFloat(i.amount)};a.used=a.total-a.free,s[r]=a}return this.parseBalance(s)}async createOrder(e,s,i,r,a,o={}){if(await this.loadMarkets(),"market"===s)throw new t(this.id+" allows limit orders only");let d={client_order_id:this.nonce().toString(),symbol:this.marketId(e),amount:r.toString(),price:a.toString(),side:i,type:"exchange limit"},n=await this.privatePostOrderNew(this.extend(d,o));return{info:n,id:n.order_id}}async cancelOrder(e,t,s={}){return await this.loadMarkets(),await this.privatePostOrderCancel({order_id:e})}async fetchMyTrades(e,s,i,r={}){if(void 0===e)throw new t(this.id+" fetchMyTrades requires a symbol argument");await this.loadMarkets();let a=this.market(e),o={symbol:a.id};void 0!==i&&(o.limit=i);let d=await this.privatePostMytrades(this.extend(o,r));return this.parseTrades(d,a,s,i)}async withdraw(e,t,s,i,r={}){this.checkAddress(s),await this.loadMarkets();let a=this.currency(e),o=await this.privatePostWithdrawCurrency(this.extend({currency:a.id,amount:t,address:s},r));return{info:o,id:this.safeString(o,"txHash")}}sign(e,t="public",s="GET",i={},r,a){let o="/"+this.version+"/"+this.implodeParams(e,i),d=this.omit(i,this.extractParams(e));if("public"===t)Object.keys(d).length&&(o+="?"+this.urlencode(d));else{this.checkRequiredCredentials();let e=this.nonce(),t=this.extend({request:o,nonce:e},d),s=this.json(t);s=this.stringToBase64(this.encode(s));let i=this.hmac(s,this.encode(this.secret),"sha384");r={"Content-Type":"text/plain","X-GEMINI-APIKEY":this.apiKey,"X-GEMINI-PAYLOAD":this.decode(s),"X-GEMINI-SIGNATURE":i}}return{url:o=this.urls.api+o,method:s,body:a,headers:r}}async request(e,s="public",i="GET",r={},a,o){let d=await this.fetch2(e,s,i,r,a,o);if("result"in d&&"error"===d.result)throw new t(this.id+" "+this.json(d));return d}async createDepositAddress(e,t={}){await this.loadMarkets();let s=this.currency(e),i=await this.privatePostDepositCurrencyNewAddress(this.extend({currency:s.id},t)),r=this.safeString(i,"address");return this.checkAddress(r),{currency:e,address:r,status:"ok",info:i}}};
//# sourceMappingURL=gemini.js.map