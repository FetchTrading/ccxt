"use strict";const e=require("./base/Exchange"),{ExchangeError:t,AuthenticationError:s,InvalidNonce:i,InsufficientFunds:a,InvalidOrder:r,OrderNotFound:o,PermissionDenied:d}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"bitbank",name:"bitbank",countries:"JP",version:"v1",has:{fetchOHLCV:!0,fetchOpenOrders:!0,fetchMyTrades:!0,fetchDepositAddress:!0,withdraw:!0},timeframes:{"1m":"1min","5m":"5min","15m":"15min","30m":"30min","1h":"1hour","4h":"4hour","8h":"8hour","12h":"12hour","1d":"1day","1w":"1week"},urls:{logo:"https://user-images.githubusercontent.com/1294454/37808081-b87f2d9c-2e59-11e8-894d-c1900b7584fe.jpg",api:{public:"https://public.bitbank.cc",private:"https://api.bitbank.cc"},www:"https://bitbank.cc/",doc:"https://docs.bitbank.cc/",fees:"https://bitbank.cc/docs/fees/"},api:{public:{get:["{pair}/ticker","{pair}/depth","{pair}/transactions","{pair}/transactions/{YYYYMMDD}","{pair}/candlestick/{candle-type}/{YYYYMMDD}"]},private:{get:["user/assets","user/spot/order","user/spot/active_orders","user/spot/trade_history","user/withdrawal_account"],post:["user/spot/order","user/spot/cancel_order","user/spot/cancel_orders","user/spot/orders_info","user/request_withdrawal"]}},markets:{"BCH/BTC":{id:"bcc_btc",symbol:"BCH/BTC",base:"BCH",quote:"BTC",baseId:"bcc",quoteId:"btc"},"BCH/JPY":{id:"bcc_jpy",symbol:"BCH/JPY",base:"BCH",quote:"JPY",baseId:"bcc",quoteId:"jpy"},"MONA/BTC":{id:"mona_btc",symbol:"MONA/BTC",base:"MONA",quote:"BTC",baseId:"mona",quoteId:"btc"},"MONA/JPY":{id:"mona_jpy",symbol:"MONA/JPY",base:"MONA",quote:"JPY",baseId:"mona",quoteId:"jpy"},"ETH/BTC":{id:"eth_btc",symbol:"ETH/BTC",base:"ETH",quote:"BTC",baseId:"eth",quoteId:"btc"},"LTC/BTC":{id:"ltc_btc",symbol:"LTC/BTC",base:"LTC",quote:"BTC",baseId:"ltc",quoteId:"btc"},"XRP/JPY":{id:"xrp_jpy",symbol:"XRP/JPY",base:"XRP",quote:"JPY",baseId:"xrp",quoteId:"jpy"},"BTC/JPY":{id:"btc_jpy",symbol:"BTC/JPY",base:"BTC",quote:"JPY",baseId:"btc",quoteId:"jpy"}},fees:{trading:{maker:0,taker:0},funding:{withdraw:{BTC:.001,LTC:.001,XRP:.15,ETH:5e-4,MONA:.001,BCC:.001}}},precision:{price:8,amount:8},exceptions:{20001:s,20002:s,20003:s,20005:s,20004:i,40020:r,40021:r,40025:t,40013:o,40014:o,50008:d,50009:o,50010:o,60001:a,60005:r}})}parseTicker(e,t){let s=t.symbol,i=e.timestamp,a=this.safeFloat(e,"last");return{symbol:s,timestamp:i,datetime:this.iso8601(i),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"buy"),bidVolume:void 0,ask:this.safeFloat(e,"sell"),askVolume:void 0,vwap:void 0,open:void 0,close:a,last:a,previousClose:void 0,change:void 0,percentage:void 0,average:void 0,baseVolume:this.safeFloat(e,"vol"),quoteVolume:void 0,info:e}}async fetchTicker(e,t={}){await this.loadMarkets();let s=this.market(e),i=await this.publicGetPairTicker(this.extend({pair:s.id},t));return this.parseTicker(i.data,s)}async fetchOrderBook(e,t,s={}){await this.loadMarkets();let i=(await this.publicGetPairDepth(this.extend({pair:this.marketId(e)},s))).data;return this.parseOrderBook(i,i.timestamp)}parseTrade(e,t){let s=e.executed_at,i=this.safeFloat(e,"price"),a=this.safeFloat(e,"amount"),r=t.symbol,o=this.costToPrecision(r,i*a),d=this.safeString(e,"transaction_id");d||(d=this.safeString(e,"trade_id"));let n=void 0;return"fee_amount_quote"in e&&(n={currency:t.quote,cost:this.safeFloat(e,"fee_amount_quote")}),{timestamp:s,datetime:this.iso8601(s),symbol:r,id:d,order:this.safeString(e,"order_id"),type:this.safeString(e,"type"),side:e.side,price:i,amount:a,cost:o,fee:n,info:e}}async fetchTrades(e,t,s,i={}){await this.loadMarkets();let a=this.market(e),r=await this.publicGetPairTransactions(this.extend({pair:a.id},i));return this.parseTrades(r.data.transactions,a,t,s)}parseOHLCV(e,t,s="5m",i,a){return[e[5],parseFloat(e[0]),parseFloat(e[1]),parseFloat(e[2]),parseFloat(e[3]),parseFloat(e[4])]}async fetchOHLCV(e,t="5m",s,i,a={}){await this.loadMarkets();let r=this.market(e),o=this.milliseconds();o=(o=this.ymd(o)).split("-");let d=(await this.publicGetPairCandlestickCandleTypeYYYYMMDD(this.extend({pair:r.id,"candle-type":this.timeframes[t],YYYYMMDD:o.join("")},a))).data.candlestick[0].ohlcv;return this.parseOHLCVs(d,r,t,s,i)}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privateGetUserAssets(e),s={info:t},i=t.data.assets;for(let e=0;e<i.length;e++){let t=i[e],a=t.asset,r=a;a in this.currencies_by_id&&(r=this.currencies_by_id[a].code);let o={free:parseFloat(t.free_amount),used:parseFloat(t.locked_amount),total:parseFloat(t.onhand_amount)};s[r]=o}return this.parseBalance(s)}parseOrder(e,t){let s=this.safeString(e,"pair"),i=void 0;s&&!t&&s in this.marketsById&&(t=this.marketsById[s]),t&&(i=t.symbol);let a=this.safeInteger(e,"ordered_at"),r=this.safeFloat(e,"price"),o=this.safeFloat(e,"start_amount"),d=this.safeFloat(e,"executed_amount"),n=this.safeFloat(e,"remaining_amount"),c=d*this.safeFloat(e,"average_price"),h=this.safeString(e,"status");h="FULLY_FILLED"===h?"closed":"CANCELED_UNFILLED"===h||"CANCELED_PARTIALLY_FILLED"===h?"canceled":"open";let l=this.safeString(e,"type");void 0!==l&&(l=l.toLowerCase());let u=this.safeString(e,"side");return void 0!==u&&(u=u.toLowerCase()),{id:this.safeString(e,"order_id"),datetime:this.iso8601(a),timestamp:a,lastTradeTimestamp:void 0,status:h,symbol:i,type:l,side:u,price:r,cost:c,amount:o,filled:d,remaining:n,trades:void 0,fee:void 0,info:e}}async createOrder(e,t,s,i,a,o={}){await this.loadMarkets();let d=this.market(e);if(void 0===a)throw new r(this.id+" createOrder requires a price argument for both market and limit orders");let n={pair:d.id,amount:this.amountToString(e,i),price:this.priceToPrecision(e,a),side:s,type:t},c=await this.privatePostUserSpotOrder(this.extend(n,o)),h=c.data.order_id,l=this.parseOrder(c.data,d);return this.orders[h]=l,l}async cancelOrder(e,t,s={}){await this.loadMarkets();let i=this.market(t);return(await this.privatePostUserSpotCancelOrder(this.extend({order_id:e,pair:i.id},s))).data}async fetchOrder(e,t,s={}){await this.loadMarkets();let i=this.market(t),a=await this.privateGetUserSpotOrder(this.extend({order_id:e,pair:i.id},s));return this.parseOrder(a.data)}async fetchOpenOrders(e,t,s,i={}){await this.loadMarkets();let a=this.market(e),r={pair:a.id};s&&(r.count=s),t&&(r.since=parseInt(t/1e3));let o=await this.privateGetUserSpotActiveOrders(this.extend(r,i));return this.parseOrders(o.data.orders,a,t,s)}async fetchMyTrades(e,t,s,i={}){let a=void 0;void 0!==e&&(await this.loadMarkets(),a=this.market(e));let r={};void 0!==a&&(r.pair=a.id),void 0!==s&&(r.count=s),void 0!==t&&(r.since=parseInt(t/1e3));let o=await this.privateGetUserSpotTradeHistory(this.extend(r,i));return this.parseTrades(o.data.trades,a,t,s)}async fetchDepositAddress(e,t={}){await this.loadMarkets();let s=this.currency(e),i=await this.privateGetUserWithdrawalAccount(this.extend({asset:s.id},t)),a=i.data.accounts,r=this.safeString(a[0],"address");return{currency:s,address:r,tag:void 0,status:r?"ok":"none",info:i}}async withdraw(e,s,i,a,r={}){if(!("uuid"in r))throw new t(this.id+" uuid is required for withdrawal");await this.loadMarkets();let o=this.currency(e),d=await this.privatePostUserRequestWithdrawal(this.extend({asset:o.id,amount:s},r));return{info:d,id:d.data.txid}}nonce(){return this.milliseconds()}sign(e,t="public",s="GET",i={},a,r){let o=this.omit(i,this.extractParams(e)),d=this.urls.api[t]+"/";if("public"===t)d+=this.implodeParams(e,i),Object.keys(o).length&&(d+="?"+this.urlencode(o));else{this.checkRequiredCredentials();let t=this.nonce().toString(),n=t;d+=this.version+"/"+this.implodeParams(e,i),"POST"===s?n+=r=this.json(o):(n+="/"+this.version+"/"+e,Object.keys(o).length&&(d+="?"+(o=this.urlencode(o)),n+="?"+o)),a={"Content-Type":"application/json","ACCESS-KEY":this.apiKey,"ACCESS-NONCE":t,"ACCESS-SIGNATURE":this.hmac(this.encode(n),this.encode(this.secret))}}return{url:d,method:s,body:r,headers:a}}async request(e,s="public",i="GET",a={},r,o){let d=await this.fetch2(e,s,i,a,r,o),n=this.safeInteger(d,"success"),c=this.safeValue(d,"data");if(!n||!c){let e={10000:"URL does not exist",10001:"A system error occurred. Please contact support",10002:"Invalid JSON format. Please check the contents of transmission",10003:"A system error occurred. Please contact support",10005:"A timeout error occurred. Please wait for a while and try again",20001:"API authentication failed",20002:"Illegal API key",20003:"API key does not exist",20004:"API Nonce does not exist",20005:"API signature does not exist",20011:"Two-step verification failed",20014:"SMS authentication failed",30001:"Please specify the order quantity",30006:"Please specify the order ID",30007:"Please specify the order ID array",30009:"Please specify the stock",30012:"Please specify the order price",30013:"Trade Please specify either",30015:"Please specify the order type",30016:"Please specify asset name",30019:"Please specify uuid",30039:"Please specify the amount to be withdrawn",40001:"The order quantity is invalid",40006:"Count value is invalid",40007:"End time is invalid",40008:"end_id Value is invalid",40009:"The from_id value is invalid",40013:"The order ID is invalid",40014:"The order ID array is invalid",40015:"Too many specified orders",40017:"Incorrect issue name",40020:"The order price is invalid",40021:"The trading classification is invalid",40022:"Start date is invalid",40024:"The order type is invalid",40025:"Incorrect asset name",40028:"uuid is invalid",40048:"The amount of withdrawal is illegal",50003:"Currently, this account is in a state where you can not perform the operation you specified. Please contact support",50004:"Currently, this account is temporarily registered. Please try again after registering your account",50005:"Currently, this account is locked. Please contact support",50006:"Currently, this account is locked. Please contact support",50008:"User identification has not been completed",50009:"Your order does not exist",50010:"Can not cancel specified order",50011:"API not found",60001:"The number of possessions is insufficient",60002:"It exceeds the quantity upper limit of the tender buying order",60003:"The specified quantity exceeds the limit",60004:"The specified quantity is below the threshold",60005:"The specified price is above the limit",60006:"The specified price is below the lower limit",70001:"A system error occurred. Please contact support",70002:"A system error occurred. Please contact support",70003:"A system error occurred. Please contact support",70004:"We are unable to accept orders as the transaction is currently suspended",70005:"Order can not be accepted because purchase order is currently suspended",70006:"We can not accept orders because we are currently unsubscribed "},s=this.exceptions,i=this.safeString(c,"code"),a=this.safeString(e,i,"Error"),r=this.safeValue(s,i);throw void 0!==r?new r(a):new t(this.id+" "+this.json(d))}return d}};
//# sourceMappingURL=bitbank.js.map