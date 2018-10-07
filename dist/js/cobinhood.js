"use strict";const e=require("./base/Exchange"),{ExchangeError:t,InsufficientFunds:i,InvalidNonce:s,InvalidOrder:r,PermissionDenied:a}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"cobinhood",name:"COBINHOOD",countries:"TW",rateLimit:100,has:{fetchCurrencies:!0,fetchTickers:!0,fetchOHLCV:!0,fetchOpenOrders:!0,fetchClosedOrders:!0,fetchOrder:!0,fetchDepositAddress:!0,createDepositAddress:!0,withdraw:!0,fetchMyTrades:!0},requiredCredentials:{apiKey:!0,secret:!1},timeframes:{"1m":"1m","5m":"5m","15m":"15m","30m":"30m","1h":"1h","3h":"3h","6h":"6h","12h":"12h","1d":"1D","7d":"7D","14d":"14D","1M":"1M"},urls:{logo:"https://user-images.githubusercontent.com/1294454/35755576-dee02e5c-0878-11e8-989f-1595d80ba47f.jpg",api:{web:"https://api.cobinhood.com/v1",ws:"wss://feed.cobinhood.com"},www:"https://cobinhood.com",doc:"https://cobinhood.github.io/api-public"},api:{system:{get:["info","time","messages","messages/{message_id}"]},admin:{get:["system/messages","system/messages/{message_id}"],post:["system/messages"],patch:["system/messages/{message_id}"],delete:["system/messages/{message_id}"]},public:{get:["market/tickers","market/currencies","market/trading_pairs","market/orderbooks/{trading_pair_id}","market/stats","market/tickers/{trading_pair_id}","market/trades/{trading_pair_id}","chart/candles/{trading_pair_id}"]},private:{get:["trading/orders/{order_id}","trading/orders/{order_id}/trades","trading/orders","trading/order_history","trading/trades","trading/trades/{trade_id}","wallet/balances","wallet/ledger","wallet/deposit_addresses","wallet/withdrawal_addresses","wallet/withdrawals/{withdrawal_id}","wallet/withdrawals","wallet/deposits/{deposit_id}","wallet/deposits"],post:["trading/orders","wallet/deposit_addresses","wallet/withdrawal_addresses","wallet/withdrawals"],delete:["trading/orders/{order_id}"]}},fees:{trading:{maker:0,taker:0}},precision:{amount:8,price:8},exceptions:{insufficient_balance:i,invalid_nonce:s,unauthorized_scope:a}})}async fetchCurrencies(e={}){let t=(await this.publicGetMarketCurrencies(e)).result.currencies,i={};for(let e=0;e<t.length;e++){let s=t[e],r=s.currency,a=this.commonCurrencyCode(r),d=this.safeFloat(s,"min_unit");i[a]={id:r,code:a,name:s.name,active:!0,status:"ok",fiat:!1,precision:this.precisionFromString(s.min_unit),limits:{amount:{min:d,max:void 0},price:{min:d,max:void 0},deposit:{min:d,max:void 0},withdraw:{min:d,max:void 0}},funding:{withdraw:{fee:this.safeFloat(s,"withdrawal_fee")},deposit:{fee:this.safeFloat(s,"deposit_fee")}},info:s}}return i}async fetchMarkets(){let e=(await this.publicGetMarketTradingPairs()).result.trading_pairs,t=[];for(let i=0;i<e.length;i++){let s=e[i],r=s.id,[a,d]=r.split("-"),o=this.commonCurrencyCode(a),n=this.commonCurrencyCode(d),l=o+"/"+n,h={amount:8,price:this.precisionFromString(s.quote_increment)},c=this.safeValue(s,"is_active",!0);t.push({id:r,symbol:l,base:o,quote:n,baseId:a,quoteId:d,active:c,precision:h,limits:{amount:{min:this.safeFloat(s,"base_min_size"),max:this.safeFloat(s,"base_max_size")},price:{min:void 0,max:void 0},cost:{min:void 0,max:void 0}},info:s})}return t}parseTicker(e,t){if(void 0===t){let i=this.safeString(e,"trading_pair_id");t=this.findMarket(i)}let i=void 0;void 0!==t&&(i=t.symbol);let s=this.safeInteger(e,"timestamp"),r=this.safeFloat(e,"last_trade_price");return{symbol:i,timestamp:s,datetime:this.iso8601(s),high:this.safeFloat(e,"24h_high"),low:this.safeFloat(e,"24h_low"),bid:this.safeFloat(e,"highest_bid"),bidVolume:void 0,ask:this.safeFloat(e,"lowest_ask"),askVolume:void 0,vwap:void 0,open:void 0,close:r,last:r,previousClose:void 0,change:this.safeFloat(e,"percentChanged24hr"),percentage:void 0,average:void 0,baseVolume:this.safeFloat(e,"24h_volume"),quoteVolume:this.safeFloat(e,"quote_volume"),info:e}}async fetchTicker(e,t={}){await this.loadMarkets();let i=this.market(e),s=(await this.publicGetMarketTickersTradingPairId(this.extend({trading_pair_id:i.id},t))).result.ticker;return this.parseTicker(s,i)}async fetchTickers(e,t={}){await this.loadMarkets();let i=(await this.publicGetMarketTickers(t)).result.tickers,s=[];for(let e=0;e<i.length;e++)s.push(this.parseTicker(i[e]));return this.indexBy(s,"symbol")}async fetchOrderBook(e,t,i={}){await this.loadMarkets();let s={trading_pair_id:this.marketId(e)};void 0!==t&&(s.limit=t);let r=await this.publicGetMarketOrderbooksTradingPairId(this.extend(s,i));return this.parseOrderBook(r.result.orderbook,void 0,"bids","asks",0,2)}parseTrade(e,t){let i=void 0;t&&(i=t.symbol);let s=e.timestamp,r=this.safeFloat(e,"price"),a=this.safeFloat(e,"size"),d=parseFloat(this.costToPrecision(i,r*a)),o="bid"===e.maker_side?"sell":"buy";return{info:e,timestamp:s,datetime:this.iso8601(s),symbol:i,id:e.id,order:void 0,type:void 0,side:o,price:r,amount:a,cost:d,fee:void 0}}async fetchTrades(e,t,i=50,s={}){await this.loadMarkets();let r=this.market(e),a=(await this.publicGetMarketTradesTradingPairId(this.extend({trading_pair_id:r.id,limit:i},s))).result.trades;return this.parseTrades(a,r,t,i)}parseOHLCV(e,t,i="5m",s,r){return[e.timestamp,parseFloat(e.open),parseFloat(e.high),parseFloat(e.low),parseFloat(e.close),parseFloat(e.volume)]}async fetchOHLCV(e,t="1m",i,s,r={}){await this.loadMarkets();let a=this.market(e),d=this.milliseconds(),o={trading_pair_id:a.id,timeframe:this.timeframes[t],end_time:d};void 0!==i&&(o.start_time=i);let n=(await this.publicGetChartCandlesTradingPairId(this.extend(o,r))).result.candles;return this.parseOHLCVs(n,a,t,i,s)}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privateGetWalletBalances(e),i={info:t},s=t.result.balances;for(let e=0;e<s.length;e++){let t=s[e],r=t.currency;r in this.currencies_by_id&&(r=this.currencies_by_id[r].code);let a={used:parseFloat(t.on_order),total:parseFloat(t.total)};a.free=parseFloat(a.total-a.used),i[r]=a}return this.parseBalance(i)}parseOrderStatus(e){let t={filled:"closed",rejected:"closed",partially_filled:"open",pending_cancellation:"open",pending_modification:"open",open:"open",new:"open",queued:"open",cancelled:"canceled",triggered:"triggered"};return e in t?t[e]:e}parseOrder(e,t){let i=void 0;if(void 0===t){let i=this.safeString(e,"trading_pair");i=this.safeString(e,"trading_pair_id",i),t=this.markets_by_id[i]}void 0!==t&&(i=t.symbol);let s=e.timestamp,r=this.safeFloat(e,"eq_price"),a=this.safeFloat(e,"size"),d=this.safeFloat(e,"filled"),o=void 0,n=void 0;void 0!==a&&(void 0!==d&&(o=a-d),void 0!==r&&(n=r*a));let l=this.parseOrderStatus(this.safeString(e,"state")),h=this.safeString(e,"side");return"bid"===h?h="buy":"ask"===h&&(h="sell"),{id:e.id,datetime:this.iso8601(s),timestamp:s,lastTradeTimestamp:void 0,status:l,symbol:i,type:e.type,side:h,price:r,cost:n,amount:a,filled:d,remaining:o,trades:void 0,fee:void 0,info:e}}async createOrder(e,t,i,s,r,a={}){await this.loadMarkets();let d=this.market(e);i="sell"===i?"ask":"bid";let o={trading_pair_id:d.id,type:t,side:i,size:this.amountToString(e,s)};"market"!==t&&(o.price=this.priceToPrecision(e,r));let n=await this.privatePostTradingOrders(this.extend(o,a)),l=this.parseOrder(n.result.order,d),h=l.id;return this.orders[h]=l,l}async cancelOrder(e,t,i={}){let s=await this.privateDeleteTradingOrdersOrderId(this.extend({order_id:e},i));return this.parseOrder(s)}async fetchOrder(e,t,i={}){await this.loadMarkets();let s=await this.privateGetTradingOrdersOrderId(this.extend({order_id:e.toString()},i));return this.parseOrder(s.result.order)}async fetchOpenOrders(e,t,i,s={}){await this.loadMarkets();let r=await this.privateGetTradingOrders(s),a=this.parseOrders(r.result.orders,void 0,t,i);return void 0!==e?this.filterBySymbol(a,e):a}async fetchOrderTrades(e,t,i={}){await this.loadMarkets();let s=await this.privateGetTradingOrdersOrderIdTrades(this.extend({order_id:e},i)),r=void 0===t?void 0:this.market(t);return this.parseTrades(s.result.trades,r)}async createDepositAddress(e,t={}){await this.loadMarkets();let i=this.currency(e),s=await this.privatePostWalletDepositAddresses({currency:i.id}),r=this.safeString(s.result.deposit_address,"address");return this.checkAddress(r),{currency:e,address:r,status:"ok",info:s}}async fetchDepositAddress(e,t={}){await this.loadMarkets();let i=this.currency(e),s=await this.privateGetWalletDepositAddresses(this.extend({currency:i.id},t)),r=this.safeValue(s.result,"deposit_addresses",[]),a=void 0;return r.length>0&&(a=this.safeString(r[0],"address")),this.checkAddress(a),{currency:e,address:a,status:"ok",info:s}}async withdraw(e,t,i,s={}){await this.loadMarkets();let r=this.currency(e),a=await this.privatePostWalletWithdrawals(this.extend({currency:r.id,amount:t,address:i},s));return{id:a.result.withdrawal_id,info:a}}async fetchMyTrades(e,t,i,s={}){await this.loadMarkets();let r=this.market(e),a={};void 0!==e&&(a.trading_pair_id=r.id);let d=await this.privateGetTradingTrades(this.extend(a,s));return this.parseTrades(d.result.trades,r,t,i)}sign(e,t="public",i="GET",s={},r,a){let d=this.urls.api.web+"/"+this.implodeParams(e,s),o=this.omit(s,this.extractParams(e));return r={},"private"===t&&(this.checkRequiredCredentials(),r.nonce=this.nonce().toString(),r.Authorization=this.apiKey),"GET"===i?(o=this.urlencode(o)).length&&(d+="?"+o):(r["Content-type"]="application/json; charset=UTF-8",a=this.json(o)),{url:d,method:i,body:a,headers:r}}handleErrors(e,i,s,a,d,o){if(e<400||e>=600)return;if("{"!==o[0])throw new t(this.id+" "+o);let n=JSON.parse(o);const l=this.id+" "+this.json(n);let h=this.safeValue(n.error,"error_code");if(("DELETE"===a||"GET"===a)&&"parameter_error"===h&&s.indexOf("trading/orders/")>=0)throw new r(l);const c=this.exceptions;if(h in c)throw new c[h](l);throw new t(l)}nonce(){return this.milliseconds()}};
//# sourceMappingURL=cobinhood.js.map