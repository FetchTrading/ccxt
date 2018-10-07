"use strict";const e=require("./base/Exchange"),{ExchangeError:t,InsufficientFunds:r,InvalidOrder:i,OrderNotFound:s,AuthenticationError:a}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"okcoinusd",name:"OKCoin USD",countries:["CN","US"],version:"v1",rateLimit:1e3,has:{CORS:!1,fetchOHLCV:!0,fetchOrder:!0,fetchOrders:!1,fetchOpenOrders:!0,fetchClosedOrders:!0,withdraw:!0,futures:!1},extension:".do",timeframes:{"1m":"1min","3m":"3min","5m":"5min","15m":"15min","30m":"30min","1h":"1hour","2h":"2hour","4h":"4hour","6h":"6hour","12h":"12hour","1d":"1day","3d":"3day","1w":"1week"},api:{web:{get:["spot/markets/currencies","spot/markets/products"]},public:{get:["depth","exchange_rate","future_depth","future_estimated_price","future_hold_amount","future_index","future_kline","future_price_limit","future_ticker","future_trades","kline","otcs","ticker","tickers","trades"]},private:{post:["account_records","batch_trade","borrow_money","borrow_order_info","borrows_info","cancel_borrow","cancel_order","cancel_otc_order","cancel_withdraw","funds_transfer","future_batch_trade","future_cancel","future_devolve","future_explosive","future_order_info","future_orders_info","future_position","future_position_4fix","future_trade","future_trades_history","future_userinfo","future_userinfo_4fix","lend_depth","order_fee","order_history","order_info","orders_info","otc_order_history","otc_order_info","repayment","submit_otc_order","trade","trade_history","trade_otc_order","wallet_info","withdraw","withdraw_info","unrepayments_info","userinfo"]}},urls:{logo:"https://user-images.githubusercontent.com/1294454/27766791-89ffb502-5ee5-11e7-8a5b-c5950b68ac65.jpg",api:{web:"https://www.okcoin.com/v2",public:"https://www.okcoin.com/api",private:"https://www.okcoin.com/api"},www:"https://www.okcoin.com",doc:["https://www.okcoin.com/rest_getStarted.html","https://www.npmjs.com/package/okcoin.com"]},fees:{trading:{taker:.002,maker:.002}},exceptions:{1009:s,1051:s,1019:s,20015:s,1013:i,1027:i,1002:r,1050:i,10000:t,10005:a,10008:t},options:{warnOnFetchOHLCVLimitArgument:!0,fiats:["USD","CNY"],futures:{BCH:!0,BTC:!0,BTG:!0,EOS:!0,ETC:!0,ETH:!0,LTC:!0,NEO:!0,QTUM:!0,USDT:!0,XUC:!0}}})}async fetchMarkets(){let e=(await this.webGetSpotMarketsProducts()).data,t=[];for(let r=0;r<e.length;r++){let i=e[r].symbol,[s,a]=i.split("_"),o=s.toUpperCase(),d=a.toUpperCase(),n=this.commonCurrencyCode(o),h=this.commonCurrencyCode(d),u=n+"/"+h,c={amount:e[r].maxSizeDigit,price:e[r].maxPriceDigit},l=Math.pow(10,-c.amount),p=e[r].minTradeSize,m=Math.pow(10,-c.price),f=0!==e[r].online,w=e[r].baseCurrency,_=e[r].quoteCurrency,y=this.extend(this.fees.trading,{id:i,symbol:u,base:n,quote:h,baseId:s,quoteId:a,baseNumericId:w,quoteNumericId:_,info:e[r],type:"spot",spot:!0,future:!1,lot:l,active:f,precision:c,limits:{amount:{min:p,max:void 0},price:{min:m,max:void 0},cost:{min:p*m,max:void 0}}});if(t.push(y),this.has.futures&&y.base in this.options.futures){let e=this.options.fiats;for(let r=0;r<e.length;r++){const i=e[r],s=i.toLowerCase();t.push(this.extend(y,{quote:i,symbol:y.base+"/"+i,id:y.base.toLowerCase()+"_"+s,quoteId:s,type:"future",spot:!1,future:!0}))}}}return t}async fetchOrderBook(e,t,r={}){await this.loadMarkets();let i=this.market(e),s="publicGet",a={symbol:i.id};void 0!==t&&(a.size=t),i.future&&(s+="Future",a.contract_type="this_week"),s+="Depth";let o=await this[s](this.extend(a,r));return this.parseOrderBook(o)}parseTicker(e,t){let r=e.timestamp,i=void 0;if(!t&&"symbol"in e){let r=e.symbol;r in this.markets_by_id&&(t=this.markets_by_id[r])}t&&(i=t.symbol);let s=this.safeFloat(e,"last");return{symbol:i,timestamp:r,datetime:this.iso8601(r),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"buy"),bidVolume:void 0,ask:this.safeFloat(e,"sell"),askVolume:void 0,vwap:void 0,open:void 0,close:s,last:s,previousClose:void 0,change:void 0,percentage:void 0,average:void 0,baseVolume:this.safeFloat(e,"vol"),quoteVolume:void 0,info:e}}async fetchTicker(e,r={}){await this.loadMarkets();let i=this.market(e),s="publicGet",a={symbol:i.id};i.future&&(s+="Future",a.contract_type="this_week"),s+="Ticker";let o=await this[s](this.extend(a,r)),d=this.safeValue(o,"ticker");if(void 0===d)throw new t(this.id+" fetchTicker returned an empty response: "+this.json(o));let n=this.safeInteger(o,"date");return void 0!==n&&(n*=1e3,d=this.extend(d,{timestamp:n})),this.parseTicker(d,i)}parseTrade(e,t){let r=void 0;return t&&(r=t.symbol),{info:e,timestamp:e.date_ms,datetime:this.iso8601(e.date_ms),symbol:r,id:e.tid.toString(),order:void 0,type:void 0,side:e.type,price:this.safeFloat(e,"price"),amount:this.safeFloat(e,"amount")}}async fetchTrades(e,t,r,i={}){await this.loadMarkets();let s=this.market(e),a="publicGet",o={symbol:s.id};s.future&&(a+="Future",o.contract_type="this_week"),a+="Trades";let d=await this[a](this.extend(o,i));return this.parseTrades(d,s,t,r)}parseOHLCV(e,t,r="1m",i,s){let a=e.length>6?6:5;return[e[0],e[1],e[2],e[3],e[4],e[a]]}async fetchOHLCV(e,r="1m",i,s,a={}){await this.loadMarkets();let o=this.market(e),d="publicGet",n={symbol:o.id,type:this.timeframes[r]};if(o.future&&(d+="Future",n.contract_type="this_week"),d+="Kline",void 0!==s){if(this.options.warnOnFetchOHLCVLimitArgument)throw new t(this.id+' fetchOHLCV counts "limit" candles from current time backwards, therefore the "limit" argument for '+this.id+" is disabled. Set "+this.id+'.options["warnOnFetchOHLCVLimitArgument"] = false to suppress this warning message.');n.size=parseInt(s)}n.since=void 0!==i?i:this.milliseconds()-864e5;let h=await this[d](this.extend(n,a));return this.parseOHLCVs(h,o,r,i,s)}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privatePostUserinfo(),r=t.info.funds,i={info:t},s=Object.keys(this.currencies_by_id);for(let e=0;e<s.length;e++){let t=s[e],a=this.currencies_by_id[t].code,o=this.account();o.free=this.safeFloat(r.free,t,0),o.used=this.safeFloat(r.freezed,t,0),o.total=this.sum(o.free,o.used),i[a]=o}return this.parseBalance(i)}async createOrder(e,r,i,s,a,o={}){await this.loadMarkets();let d=this.market(e),n="privatePost",h={symbol:d.id,type:i};if(d.future)n+="Future",h=this.extend(h,{contract_type:"this_week",match_price:0,lever_rate:10,price:a,amount:s});else if("limit"===r)h.price=a,h.amount=s;else if(h.type+="_market","buy"===i){if(h.price=this.safeFloat(o,"cost"),!h.price)throw new t(this.id+" market buy orders require an additional cost parameter, cost = price * amount")}else h.amount=s;o=this.omit(o,"cost"),n+="Trade";let u=await this[n](this.extend(h,o)),c=this.milliseconds();return{info:u,id:u.order_id.toString(),timestamp:c,datetime:this.iso8601(c),lastTradeTimestamp:void 0,status:void 0,symbol:e,type:r,side:i,price:a,amount:s,filled:void 0,remaining:void 0,cost:void 0,trades:void 0,fee:void 0}}async cancelOrder(e,r,i={}){if(!r)throw new t(this.id+" cancelOrder() requires a symbol argument");await this.loadMarkets();let s=this.market(r),a={symbol:s.id,order_id:e},o="privatePost";return s.future?(o+="FutureCancel",a.contract_type="this_week"):o+="CancelOrder",await this[o](this.extend(a,i))}parseOrderStatus(e){return-1===e?"canceled":0===e?"open":1===e?"open":2===e?"closed":3===e?"open":4===e?"canceled":e}parseOrderSide(e){return 1===e?"buy":2===e?"sell":3===e?"sell":4===e?"buy":e}parseOrder(e,t){let r=void 0,i=void 0;"type"in e&&("buy"===e.type||"sell"===e.type?(r=e.type,i="limit"):"buy_market"===e.type?(r="buy",i="market"):"sell_market"===e.type?(r="sell",i="market"):(r=this.parseOrderSide(e.type),("contract_name"in e||"lever_rate"in e)&&(i="margin")));let s=this.parseOrderStatus(e.status),a=void 0;t||"symbol"in e&&e.symbol in this.markets_by_id&&(t=this.markets_by_id[e.symbol]),t&&(a=t.symbol);let o=void 0,d=this.getCreateDateField();d in e&&(o=e[d]);let n=this.safeFloat(e,"amount"),h=this.safeFloat(e,"deal_amount"),u=n-h;"market"===i&&(u=0);let c=this.safeFloat(e,"avg_price"),l=(c=this.safeFloat(e,"price_avg",c))*h;return{info:e,id:e.order_id.toString(),timestamp:o,datetime:this.iso8601(o),lastTradeTimestamp:void 0,symbol:a,type:i,side:r,price:e.price,average:c,cost:l,amount:n,filled:h,remaining:u,status:s,fee:void 0}}getCreateDateField(){return"create_date"}getOrdersField(){return"orders"}async fetchOrder(e,r,i={}){if(!r)throw new t(this.id+" fetchOrder requires a symbol parameter");await this.loadMarkets();let a=this.market(r),o="privatePost",d={order_id:e,symbol:a.id};a.future&&(o+="Future",d.contract_type="this_week"),o+="OrderInfo";let n=await this[o](this.extend(d,i)),h=this.getOrdersField();if(n[h].length>0)return this.parseOrder(n[h][0]);throw new s(this.id+" order "+e+" not found")}async fetchOrders(e,r,i,s={}){if(!e)throw new t(this.id+" fetchOrders requires a symbol parameter");await this.loadMarkets();let a=this.market(e),o="privatePost",d={symbol:a.id},n="order_id"in s;if(a.future){if(o+="FutureOrdersInfo",d.contract_type="this_week",!n)throw new t(this.id+" fetchOrders() requires order_id param for futures market "+e+" (a string of one or more order ids, comma-separated)")}else{let r=void 0;if("type"in s)r=s.type;else{if(!("status"in s)){let r=n?"type":"status";throw new t(this.id+" fetchOrders() requires "+r+" param for spot market "+e+" (0 - for unfilled orders, 1 - for filled/canceled orders)")}r=s.status}n?(o+="OrdersInfo",d=this.extend(d,{type:r,order_id:s.order_id})):(o+="OrderHistory",d=this.extend(d,{status:r,current_page:1,page_length:200})),s=this.omit(s,["type","status"])}let h=await this[o](this.extend(d,s)),u=this.getOrdersField();return this.parseOrders(h[u],a,r,i)}async fetchOpenOrders(e,t,r,i={}){return await this.fetchOrders(e,t,r,this.extend({status:0},i))}async fetchClosedOrders(e,t,r,i={}){return await this.fetchOrders(e,t,r,this.extend({status:1},i))}async withdraw(e,r,i,s,a={}){this.checkAddress(i),await this.loadMarkets();let o={symbol:this.currency(e).id+"_usd",withdraw_address:i,withdraw_amount:r,target:"address"},d=a;if(!("chargefee"in d))throw new t(this.id+" withdraw() requires a `chargefee` parameter");if(o.chargefee=d.chargefee,d=this.omit(d,"chargefee"),this.password?o.trade_pwd=this.password:"password"in d?(o.trade_pwd=d.password,d=this.omit(d,"password")):"trade_pwd"in d&&(o.trade_pwd=d.trade_pwd,d=this.omit(d,"trade_pwd")),!("trade_pwd"in o))throw new t(this.id+" withdraw() requires this.password set on the exchange instance or a password / trade_pwd parameter");let n=await this.privatePostWithdraw(this.extend(o,d));return{info:n,id:this.safeString(n,"withdraw_id")}}sign(e,t="public",r="GET",i={},s,a){let o="/";if("web"!==t&&(o+=this.version+"/"),o+=e,"web"!==t&&(o+=this.extension),"private"===t){this.checkRequiredCredentials();let e=this.keysort(this.extend({api_key:this.apiKey},i)),t=this.rawencode(e)+"&secret_key="+this.secret;e.sign=this.hash(this.encode(t)).toUpperCase(),a=this.urlencode(e),s={"Content-Type":"application/x-www-form-urlencoded"}}else Object.keys(i).length&&(o+="?"+this.urlencode(i));return{url:o=this.urls.api[t]+o,method:r,body:a,headers:s}}handleErrors(e,r,i,s,a,o){if(!(o.length<2)&&"{"===o[0]){let e=JSON.parse(o);if("error_code"in e){let r=this.safeString(e,"error_code"),i=this.id+" "+this.json(e);if(r in this.exceptions){throw new(0,this.exceptions[r])(i)}throw new t(i)}if("result"in e&&!e.result)throw new t(this.id+" "+this.json(e))}}};
//# sourceMappingURL=okcoinusd.js.map