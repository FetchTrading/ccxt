"use strict";const e=require("./base/Exchange"),{ExchangeError:t,DDoSProtection:s,AuthenticationError:i,InvalidOrder:r}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"lbank",name:"LBank",countries:"CN",version:"v1",has:{fetchTickers:!0,fetchOHLCV:!0,fetchOrder:!0,fetchOrders:!0,fetchOpenOrders:!1,fetchClosedOrders:!0},timeframes:{"1m":"minute1","5m":"minute5","15m":"minute15","30m":"minute30","1h":"hour1","2h":"hour2","4h":"hour4","6h":"hour6","8h":"hour8","12h":"hour12","1d":"day1","1w":"week1"},urls:{logo:"https://user-images.githubusercontent.com/1294454/38063602-9605e28a-3302-11e8-81be-64b1e53c4cfb.jpg",api:"https://api.lbank.info",www:"https://www.lbank.info",doc:"https://www.lbank.info/api/api-overview",fees:"https://lbankinfo.zendesk.com/hc/zh-cn/articles/115002295114--%E8%B4%B9%E7%8E%87%E8%AF%B4%E6%98%8E"},api:{public:{get:["currencyPairs","ticker","depth","trades","kline"]},private:{post:["user_info","create_order","cancel_order","orders_info","orders_info_history"]}},fees:{trading:{maker:.001,taker:.001},funding:{withdraw:{BTC:void 0,ZEC:.01,ETH:.01,ETC:.01,VEN:10,BCH:2e-4,SC:50,BTM:20,NAS:1,EOS:1,XWC:5,BTS:1,INK:10,BOT:3,YOYOW:15,TGC:10,NEO:0,CMT:20,SEER:2e3,FIL:void 0,BTG:void 0}}}})}async fetchMarkets(){let e=await this.publicGetCurrencyPairs(),t=[];for(let s=0;s<e.length;s++){let i=e[s],[r,a]=i.split("_"),o=this.commonCurrencyCode(r.toUpperCase()),n=this.commonCurrencyCode(a.toUpperCase()),h=o+"/"+n,d={amount:8,price:8},l=Math.pow(10,-d.amount);t.push({id:i,symbol:h,base:o,quote:n,baseId:r,quoteId:a,active:!0,lot:l,precision:d,limits:{amount:{min:l,max:void 0},price:{min:Math.pow(10,-d.price),max:Math.pow(10,d.price)},cost:{min:void 0,max:void 0}},info:i})}return t}parseTicker(e,t){let s=t.symbol,i=this.safeInteger(e,"timestamp"),r=e;e=r.ticker;let a=this.safeFloat(e,"latest");return{symbol:s,timestamp:i,datetime:this.iso8601(i),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:void 0,bidVolume:void 0,ask:void 0,askVolume:void 0,vwap:void 0,open:void 0,close:a,last:a,previousClose:void 0,change:this.safeFloat(e,"change"),percentage:void 0,average:void 0,baseVolume:this.safeFloat(e,"vol"),quoteVolume:this.safeFloat(e,"turnover"),info:r}}async fetchTicker(e,t={}){await this.loadMarkets();let s=this.market(e),i=await this.publicGetTicker(this.extend({symbol:s.id},t));return this.parseTicker(i,s)}async fetchTickers(e,t={}){await this.loadMarkets();let s=await this.publicGetTicker(this.extend({symbol:"all"},t)),i={};for(let e=0;e<s.length;e++){let t=s[e],r=t.symbol;if(r in this.marketsById){let e=this.marketsById[r];i[e.symbol]=this.parseTicker(t,e)}}return i}async fetchOrderBook(e,t=60,s={}){await this.loadMarkets();let i=await this.publicGetDepth(this.extend({symbol:this.marketId(e),size:Math.min(t,60)},s));return this.parseOrderBook(i)}parseTrade(e,t){let s=t.symbol,i=parseInt(e.date_ms),r=this.safeFloat(e,"price"),a=this.safeFloat(e,"amount"),o=this.costToPrecision(s,r*a);return{timestamp:i,datetime:this.iso8601(i),symbol:s,id:this.safeString(e,"tid"),order:void 0,type:void 0,side:e.type,price:r,amount:a,cost:parseFloat(o),fee:void 0,info:this.safeValue(e,"info",e)}}async fetchTrades(e,t,s,i={}){await this.loadMarkets();let r=this.market(e),a={symbol:r.id,size:100};t&&(a.time=parseInt(t/1e3)),s&&(a.size=s);let o=await this.publicGetTrades(this.extend(a,i));return this.parseTrades(o,r,t,s)}async fetchOHLCV(e,t="5m",s,i,r={}){await this.loadMarkets();let a=this.market(e),o={symbol:a.id,type:this.timeframes[t],size:1e3};s&&(o.time=parseInt(s/1e3)),i&&(o.size=i);let n=await this.publicGetKline(this.extend(o,r));return this.parseOHLCVs(n,a,t,s,i)}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privatePostUserInfo(e),s={info:t},i=Object.keys(this.extend(t.info.free,t.info.freeze));for(let e=0;e<i.length;e++){let r=i[e],a=r;r in this.currencies_by_id&&(a=this.currencies_by_id[r].code);let o={free:this.safeFloat(t.info.free,r,0),used:this.safeFloat(t.info.freeze,r,0),total:0};o.total=this.sum(o.free,o.used),s[a]=o}return this.parseBalance(s)}parseOrderStatus(e){return this.safeString({"-1":"cancelled",0:"open",1:"open",2:"closed",4:"closed"},e)}parseOrder(e,t){let s=void 0,i=this.safeValue(this.marketsById,e.symbol);void 0!==i?s=i.symbol:void 0!==t&&(s=t.symbol);let r=this.safeInteger(e,"create_time"),a=this.safeFloat(e,"price"),o=this.safeFloat(e,"amount",0),n=this.safeFloat(e,"deal_amount",0),h=this.safeFloat(e,"avg_price"),d=void 0;void 0!==h&&(d=n*h);let l=this.parseOrderStatus(this.safeString(e,"status"));return{id:this.safeString(e,"order_id"),datetime:this.iso8601(r),timestamp:r,lastTradeTimestamp:void 0,status:l,symbol:s,type:this.safeString(e,"order_type"),side:e.type,price:a,cost:d,amount:o,filled:n,remaining:o-n,trades:void 0,fee:void 0,info:this.safeValue(e,"info",e)}}async createOrder(e,t,s,i,r,a={}){await this.loadMarkets();let o=this.market(e),n={symbol:o.id,type:s,amount:i};"market"===t?n.type+="_market":n.price=r;let h=await this.privatePostCreateOrder(this.extend(n,a));(n=this.omit(n,"type")).order_id=h.order_id,n.type=s,n.order_type=t,n.create_time=this.milliseconds(),n.info=h;let d=(n=this.parseOrder(n,o)).id;return this.orders[d]=n,n}async cancelOrder(e,t,s={}){await this.loadMarkets();let i=this.market(t);return await this.privatePostCancelOrder(this.extend({symbol:i.id,order_id:e},s))}async fetchOrder(e,t,s={}){await this.loadMarkets();let i=this.market(t),r=await this.privatePostOrdersInfo(this.extend({symbol:i.id,order_id:e},s)),a=this.parseOrders(r.orders,i);return 1===a.length?a[0]:a}async fetchOrders(e,t,s,i={}){await this.loadMarkets(),void 0===s&&(s=100);let r=this.market(e),a=await this.privatePostOrdersInfoHistory(this.extend({symbol:r.id,current_page:1,page_length:s},i));return this.parseOrders(a.orders,void 0,t,s)}async fetchClosedOrders(e,t,s,i={}){let r=await this.fetchOrders(e,t,s,i);return this.filterBy(r,"status","closed")+this.filterBy(r,"status","cancelled")}sign(e,t="public",s="GET",i={},r,a){let o=this.omit(i,this.extractParams(e)),n=this.urls.api+"/"+this.version+"/"+this.implodeParams(e,i);if(n+=".do","public"===t)Object.keys(o).length&&(n+="?"+this.urlencode(o));else{this.checkRequiredCredentials();let e=this.keysort(this.extend({api_key:this.apiKey},i)),t=this.rawencode(e)+"&secret_key="+this.secret;e.sign=this.hash(this.encode(t)).toUpperCase(),a=this.urlencode(e),r={"Content-Type":"application/x-www-form-urlencoded"}}return{url:n,method:s,body:a,headers:r}}async request(e,a="public",o="GET",n={},h,d){let l=await this.fetch2(e,a,o,n,h,d);if("false"===this.safeString(l,"result")){let e=this.safeString(l,"error_code"),a=this.safeString({10000:"Internal error",10001:"The required parameters can not be empty",10002:"verification failed",10003:"Illegal parameters",10004:"User requests are too frequent",10005:"Key does not exist",10006:"user does not exist",10007:"Invalid signature",10008:"This currency pair is not supported",10009:"Limit orders can not be missing orders and the number of orders",10010:"Order price or order quantity must be greater than 0",10011:"Market orders can not be missing the amount of the order",10012:"market sell orders can not be missing orders",10013:"is less than the minimum trading position 0.001",10014:"Account number is not enough",10015:"The order type is wrong",10016:"Account balance is not enough",10017:"Abnormal server",10018:"order inquiry can not be more than 50 less than one",10019:"withdrawal orders can not be more than 3 less than one",10020:"less than the minimum amount of the transaction limit of 0.001"},e,this.json(l));throw new(this.safeValue({10002:i,10004:s,10005:i,10006:i,10007:i,10009:r,10010:r,10011:r,10012:r,10013:r,10014:r,10015:r,10016:r},e,t))(a)}return l}};
//# sourceMappingURL=lbank.js.map