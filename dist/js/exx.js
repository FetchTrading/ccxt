"use strict";const e=require("./base/Exchange"),{ExchangeError:t,AuthenticationError:s}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"exx",name:"EXX",countries:"CN",rateLimit:100,has:{fetchOrder:!0,fetchTickers:!0,fetchOpenOrders:!0},urls:{logo:"https://user-images.githubusercontent.com/1294454/37770292-fbf613d0-2de4-11e8-9f79-f2dc451b8ccb.jpg",api:{public:"https://api.exx.com/data/v1",private:"https://trade.exx.com/api"},www:"https://www.exx.com/",doc:"https://www.exx.com/help/restApi",fees:"https://www.exx.com/help/rate"},api:{public:{get:["markets","tickers","ticker","depth","trades"]},private:{get:["order","cancel","getOrder","getOpenOrders","getBalance"]}},fees:{trading:{maker:.001,taker:.001},funding:{withdraw:{BCC:3e-4,BCD:0,BOT:10,BTC:.001,BTG:0,BTM:25,BTS:3,EOS:1,ETC:.01,ETH:.01,ETP:.012,HPY:0,HSR:.001,INK:20,LTC:.005,MCO:.6,MONA:.01,QASH:5,QCASH:5,QTUM:.01,USDT:5}}}})}async fetchMarkets(){let e=await this.publicGetMarkets(),t=Object.keys(e),s=[];for(let i=0;i<t.length;i++){let a=t[i],r=e[a],[o,c]=a.split("_"),n=a.toUpperCase(),[h,d]=n.split("_"),l=(h=this.commonCurrencyCode(h))+"/"+(d=this.commonCurrencyCode(d)),p=!0===r.isOpen,u={amount:parseInt(r.amountScale),price:parseInt(r.priceScale)},m=Math.pow(10,-u.amount);s.push({id:a,symbol:l,base:h,quote:d,baseId:o,quoteId:c,active:p,lot:m,precision:u,limits:{amount:{min:m,max:Math.pow(10,u.amount)},price:{min:Math.pow(10,-u.price),max:Math.pow(10,u.price)},cost:{min:void 0,max:void 0}},info:r})}return s}parseTicker(e,t){let s=t.symbol,i=parseInt(e.date);e=e.ticker;let a=this.safeFloat(e,"last");return{symbol:s,timestamp:i,datetime:this.iso8601(i),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"buy"),bidVolume:void 0,ask:this.safeFloat(e,"sell"),askVolume:void 0,vwap:void 0,open:void 0,close:a,last:a,previousClose:void 0,change:this.safeFloat(e,"riseRate"),percentage:void 0,average:void 0,baseVolume:this.safeFloat(e,"vol"),quoteVolume:void 0,info:e}}async fetchTicker(e,t={}){await this.loadMarkets();let s=this.market(e),i=await this.publicGetTicker(this.extend({currency:s.id},t));return this.parseTicker(i,s)}async fetchTickers(e,t={}){await this.loadMarkets();let s=await this.publicGetTickers(t),i={},a=this.milliseconds(),r=Object.keys(s);for(let e=0;e<r.length;e++){let t=r[e];if(!(t in this.marketsById))continue;let o=this.marketsById[t],c=o.symbol,n={date:a,ticker:s[t]};i[c]=this.parseTicker(n,o)}return i}async fetchOrderBook(e,t,s={}){await this.loadMarkets();let i=await this.publicGetDepth(this.extend({currency:this.marketId(e)},s));return this.parseOrderBook(i,i.timestamp)}parseTrade(e,t){let s=1e3*e.date,i=this.safeFloat(e,"price"),a=this.safeFloat(e,"amount"),r=t.symbol,o=this.costToPrecision(r,i*a);return{timestamp:s,datetime:this.iso8601(s),symbol:r,id:this.safeString(e,"tid"),order:void 0,type:"limit",side:e.type,price:i,amount:a,cost:o,fee:void 0,info:e}}async fetchTrades(e,t,s,i={}){await this.loadMarkets();let a=this.market(e),r=await this.publicGetTrades(this.extend({currency:a.id},i));return this.parseTrades(r,a,t,s)}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privateGetGetBalance(e),s={info:t};t=t.funds;let i=Object.keys(t);for(let e=0;e<i.length;e++){let a=i[e],r=t[a],o=this.commonCurrencyCode(a),c={free:parseFloat(r.balance),used:parseFloat(r.freeze),total:parseFloat(r.total)};s[o]=c}return this.parseBalance(s)}parseOrder(e,t){let s=t.symbol,i=parseInt(e.trade_date),a=this.safeFloat(e,"price"),r=this.safeFloat(e,"trade_money"),o=this.safeFloat(e,"total_amount"),c=this.safeFloat(e,"trade_amount",0),n=this.amountToPrecision(s,o-c),h=this.safeInteger(e,"status");h=1===h?"canceled":2===h?"closed":"open";let d=void 0;return"fees"in e&&(d={cost:this.safeFloat(e,"fees"),currency:t.quote}),{id:this.safeString(e,"id"),datetime:this.iso8601(i),timestamp:i,lastTradeTimestamp:void 0,status:"open",symbol:s,type:"limit",side:e.type,price:a,cost:r,amount:o,filled:c,remaining:n,trades:void 0,fee:d,info:e}}async createOrder(e,t,s,i,a,r={}){await this.loadMarkets();let o=this.market(e),c=await this.privateGetOrder(this.extend({currency:o.id,type:s,price:a,amount:i},r)),n=c.id,h=this.parseOrder({id:n,trade_date:this.milliseconds(),total_amount:i,price:a,type:s,info:c},o);return this.orders[n]=h,h}async cancelOrder(e,t,s={}){await this.loadMarkets();let i=this.market(t);return await this.privateGetCancel(this.extend({id:e,currency:i.id},s))}async fetchOrder(e,t,s={}){await this.loadMarkets();let i=this.market(t),a=await this.privateGetGetOrder(this.extend({id:e,currency:i.id},s));return this.parseOrder(a,i)}async fetchOpenOrders(e,t,s,i={}){await this.loadMarkets();let a=this.market(e),r=await this.privateGetOpenOrders(this.extend({currency:a.id},i));return this.parseOrders(r,a,t,s)}nonce(){return this.milliseconds()}sign(e,t="public",s="GET",i={},a,r){let o=this.urls.api[t]+"/"+e;if("public"===t)Object.keys(i).length&&(o+="?"+this.urlencode(i));else{this.checkRequiredCredentials();let e=this.urlencode(this.keysort(this.extend({accesskey:this.apiKey,nonce:this.nonce()},i)));o+="?"+e+"&signature="+this.hmac(this.encode(e),this.encode(this.secret),"sha512")}return{url:o,method:s,body:r,headers:a}}async request(e,i="public",a="GET",r={},o,c){let n=await this.fetch2(e,i,a,r,o,c),h=this.safeInteger(n,"code"),d=this.safeString(n,"message");if(h&&100!==h&&d){if(103===h)throw new s(d);throw new t(d)}return n}};
//# sourceMappingURL=exx.js.map