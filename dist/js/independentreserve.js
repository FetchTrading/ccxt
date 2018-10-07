"use strict";const e=require("./base/Exchange");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"independentreserve",name:"Independent Reserve",countries:["AU","NZ"],rateLimit:1e3,has:{CORS:!1},urls:{logo:"https://user-images.githubusercontent.com/1294454/30521662-cf3f477c-9bcb-11e7-89bc-d1ac85012eda.jpg",api:{public:"https://api.independentreserve.com/Public",private:"https://api.independentreserve.com/Private"},www:"https://www.independentreserve.com",doc:"https://www.independentreserve.com/API"},api:{public:{get:["GetValidPrimaryCurrencyCodes","GetValidSecondaryCurrencyCodes","GetValidLimitOrderTypes","GetValidMarketOrderTypes","GetValidOrderTypes","GetValidTransactionTypes","GetMarketSummary","GetOrderBook","GetTradeHistorySummary","GetRecentTrades","GetFxRates"]},private:{post:["PlaceLimitOrder","PlaceMarketOrder","CancelOrder","GetOpenOrders","GetClosedOrders","GetClosedFilledOrders","GetOrderDetails","GetAccounts","GetTransactions","GetDigitalCurrencyDepositAddress","GetDigitalCurrencyDepositAddresses","SynchDigitalCurrencyDepositAddressWithBlockchain","WithdrawDigitalCurrency","RequestFiatWithdrawal","GetTrades"]}},fees:{trading:{taker:.005,maker:.005,percentage:!0,tierBased:!1}}})}async fetchMarkets(){let e=await this.publicGetGetValidPrimaryCurrencyCodes(),t=await this.publicGetGetValidSecondaryCurrencyCodes(),r=[];for(let i=0;i<e.length;i++){let a=e[i],s=a.toUpperCase(),d=this.commonCurrencyCode(s);for(let e=0;e<t.length;e++){let i=t[e],s=i.toUpperCase(),o=this.commonCurrencyCode(s),n=a+"/"+i,l=d+"/"+o;r.push({id:n,symbol:l,base:d,quote:o,baseId:a,quoteId:i,info:n})}}return r}async fetchBalance(e={}){await this.loadMarkets();let t=await this.privatePostGetAccounts(),r={info:t};for(let e=0;e<t.length;e++){let i=t[e],a=i.CurrencyCode.toUpperCase(),s=this.commonCurrencyCode(a),d=this.account();d.free=i.AvailableBalance,d.total=i.TotalBalance,d.used=d.total-d.free,r[s]=d}return this.parseBalance(r)}async fetchOrderBook(e,t,r={}){await this.loadMarkets();let i=this.market(e),a=await this.publicGetGetOrderBook(this.extend({primaryCurrencyCode:i.baseId,secondaryCurrencyCode:i.quoteId},r)),s=this.parse8601(a.CreatedTimestampUtc);return this.parseOrderBook(a,s,"BuyOrders","SellOrders","Price","Volume")}parseTicker(e,t){let r=this.parse8601(e.CreatedTimestampUtc),i=void 0;t&&(i=t.symbol);let a=e.LastPrice;return{symbol:i,timestamp:r,datetime:this.iso8601(r),high:e.DayHighestPrice,low:e.DayLowestPrice,bid:e.CurrentHighestBidPrice,bidVolume:void 0,ask:e.CurrentLowestOfferPrice,askVolume:void 0,vwap:void 0,open:void 0,close:a,last:a,previousClose:void 0,change:void 0,percentage:void 0,average:e.DayAvgPrice,baseVolume:e.DayVolumeXbtInSecondaryCurrrency,quoteVolume:void 0,info:e}}async fetchTicker(e,t={}){await this.loadMarkets();let r=this.market(e),i=await this.publicGetGetMarketSummary(this.extend({primaryCurrencyCode:r.baseId,secondaryCurrencyCode:r.quoteId},t));return this.parseTicker(i,r)}parseOrder(e,t){let r=void 0;void 0===t?r=t.symbol:t=this.findMarket(e.PrimaryCurrencyCode+"/"+e.SecondaryCurrencyCode);let i=this.safeValue(e,"Type");i.indexOf("Market")>=0?i="market":i.indexOf("Limit")>=0&&(i="limit");let a=void 0;i.indexOf("Bid")>=0?a="buy":i.indexOf("Offer")>=0&&(a="sell");let s=this.parse8601(e.CreatedTimestampUtc),d=this.safeFloat(e,"VolumeOrdered");void 0===d&&(d=this.safeFloat(e,"Volume"));let o=this.safeFloat(e,"VolumeFilled"),n=void 0,l=this.safeFloat(e,"FeePercent"),c=void 0;void 0!==d&&void 0!==o&&(n=d-o,void 0!==l&&(c=l*o));let h=void 0;void 0!==t&&(r=t.symbol,h=t.base);let u={rate:l,cost:c,currency:h},p=e.OrderGuid,y=this.parseOrderStatus(e.Status),m=this.safeFloat(e,"Value"),C=this.safeFloat(e,"AvgPrice"),f=this.safeFloat(e,"Price",C);return{info:e,id:p,timestamp:s,datetime:this.iso8601(s),lastTradeTimestamp:void 0,symbol:r,type:i,side:a,price:f,cost:m,average:C,amount:d,filled:o,remaining:n,status:y,fee:u}}parseOrderStatus(e){let t={Open:"open",PartiallyFilled:"open",Filled:"closed",PartiallyFilledAndCancelled:"canceled",Cancelled:"canceled",PartiallyFilledAndExpired:"canceled",Expired:"canceled"};return e in t?t[e]:e}async fetchOrder(e,t,r={}){await this.loadMarkets();const i=await this.privatePostGetOrderDetails(this.extend({orderGuid:e},r));let a=void 0;return void 0!==t&&(a=this.market(t)),this.parseOrder(i,a)}async fetchMyTrades(e,t,r=50,i={}){await this.loadMarkets();let a=this.safeInteger(i,"pageIndex",1);const s=this.ordered({pageIndex:a,pageSize:r}),d=await this.privatePostGetTrades(this.extend(s,i));let o=void 0;return void 0!==e&&(o=this.market(e)),this.parseTrades(d.Data,o,t,r)}parseTrade(e,t){let r=this.parse8601(e.TradeTimestampUtc),i=this.safeString(e,"TradeGuid"),a=this.safeString(e,"OrderGuid"),s=this.safeFloat(e,"Price");void 0===s&&(s=this.safeFloat(e,"SecondaryCurrencyTradePrice"));let d=this.safeFloat(e,"VolumeTraded");void 0===d&&(d=this.safeFloat(e,"PrimaryCurrencyAmount"));let o=void 0;void 0!==t&&(o=t.symbol);let n=this.safeString(e,"OrderType");return void 0!==n&&(n.indexOf("Bid")>=0?n="buy":n.indexOf("Offer")>=0&&(n="sell")),{id:i,info:e,timestamp:r,datetime:this.iso8601(r),symbol:o,order:a,type:void 0,side:n,price:s,amount:d,fee:void 0}}async fetchTrades(e,t,r,i={}){await this.loadMarkets();let a=this.market(e),s=await this.publicGetGetRecentTrades(this.extend({primaryCurrencyCode:a.baseId,secondaryCurrencyCode:a.quoteId,numberOfRecentTradesToRetrieve:50},i));return this.parseTrades(s.Trades,a,t,r)}async createOrder(e,t,r,i,a,s={}){await this.loadMarkets();let d=this.market(e),o=this.capitalize(t),n="privatePostPlace"+o+"Order",l=o;l+="sell"===r?"Offer":"Bid";let c=this.ordered({primaryCurrencyCode:d.baseId,secondaryCurrencyCode:d.quoteId,orderType:l});"limit"===t&&(c.price=a),c.volume=i;let h=await this[n](this.extend(c,s));return{info:h,id:h.OrderGuid}}async cancelOrder(e,t,r={}){return await this.loadMarkets(),await this.privatePostCancelOrder({orderGuid:e})}sign(e,t="public",r="GET",i={},a,s){let d=this.urls.api[t]+"/"+e;if("public"===t)Object.keys(i).length&&(d+="?"+this.urlencode(i));else{this.checkRequiredCredentials();let e=this.nonce(),t=[d,"apiKey="+this.apiKey,"nonce="+e.toString()],r=Object.keys(i),o=[];for(let e=0;e<r.length;e++){let t=r[e];o.push(t+"="+i[t])}let n=(t=this.arrayConcat(t,o)).join(","),l=this.hmac(this.encode(n),this.encode(this.secret));s=this.json({apiKey:this.apiKey,nonce:e,signature:l}),a={"Content-Type":"application/json"}}return{url:d,method:r,body:s,headers:a}}};
//# sourceMappingURL=independentreserve.js.map