"use strict";const e=require("./base/Exchange"),{ExchangeError:t,AuthenticationError:r,InvalidAddress:i,InsufficientFunds:s,OrderNotFound:a,InvalidOrder:n,PermissionDenied:c}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"gatecoin",name:"Gatecoin",rateLimit:2e3,countries:"HK",comment:"a regulated/licensed exchange",has:{CORS:!1,createDepositAddress:!0,fetchDepositAddress:!0,fetchOHLCV:!0,fetchOpenOrders:!0,fetchOrder:!0,fetchTickers:!0,withdraw:!0},timeframes:{"1m":"1m","15m":"15m","1h":"1h","6h":"6h","1d":"24h"},urls:{logo:"https://user-images.githubusercontent.com/1294454/28646817-508457f2-726c-11e7-9eeb-3528d2413a58.jpg",api:"https://api.gatecoin.com",www:"https://gatecoin.com",doc:["https://gatecoin.com/api","https://github.com/Gatecoin/RESTful-API-Implementation","https://api.gatecoin.com/swagger-ui/index.html"]},api:{public:{get:["Public/ExchangeRate","Public/LiveTicker","Public/LiveTicker/{CurrencyPair}","Public/LiveTickers","Public/MarketDepth/{CurrencyPair}","Public/NetworkStatistics/{DigiCurrency}","Public/StatisticHistory/{DigiCurrency}/{Typeofdata}","Public/TickerHistory/{CurrencyPair}/{Timeframe}","Public/Transactions/{CurrencyPair}","Public/TransactionsHistory/{CurrencyPair}","Reference/BusinessNatureList","Reference/Countries","Reference/Currencies","Reference/CurrencyPairs","Reference/CurrentStatusList","Reference/IdentydocumentTypes","Reference/IncomeRangeList","Reference/IncomeSourceList","Reference/VerificationLevelList","Stream/PublicChannel"],post:["Export/Transactions","Ping","Public/Unsubscribe/{EmailCode}","RegisterUser"]},private:{get:["Account/CorporateData","Account/DocumentAddress","Account/DocumentCorporation","Account/DocumentID","Account/DocumentInformation","Account/Email","Account/FeeRate","Account/Level","Account/PersonalInformation","Account/Phone","Account/Profile","Account/Questionnaire","Account/Referral","Account/ReferralCode","Account/ReferralNames","Account/ReferralReward","Account/ReferredCode","Account/ResidentInformation","Account/SecuritySettings","Account/User","APIKey/APIKey","Auth/ConnectionHistory","Balance/Balances","Balance/Balances/{Currency}","Balance/Deposits","Balance/Withdrawals","Bank/Accounts/{Currency}/{Location}","Bank/Transactions","Bank/UserAccounts","Bank/UserAccounts/{Currency}","ElectronicWallet/DepositWallets","ElectronicWallet/DepositWallets/{DigiCurrency}","ElectronicWallet/Transactions","ElectronicWallet/Transactions/{DigiCurrency}","ElectronicWallet/UserWallets","ElectronicWallet/UserWallets/{DigiCurrency}","Info/ReferenceCurrency","Info/ReferenceLanguage","Notification/Messages","Trade/Orders","Trade/Orders/{OrderID}","Trade/StopOrders","Trade/StopOrdersHistory","Trade/Trades","Trade/UserTrades"],post:["Account/DocumentAddress","Account/DocumentCorporation","Account/DocumentID","Account/Email/RequestVerify","Account/Email/Verify","Account/GoogleAuth","Account/Level","Account/Questionnaire","Account/Referral","APIKey/APIKey","Auth/ChangePassword","Auth/ForgotPassword","Auth/ForgotUserID","Auth/Login","Auth/Logout","Auth/LogoutOtherSessions","Auth/ResetPassword","Bank/Transactions","Bank/UserAccounts","ElectronicWallet/DepositWallets/{DigiCurrency}","ElectronicWallet/Transactions/Deposits/{DigiCurrency}","ElectronicWallet/Transactions/Withdrawals/{DigiCurrency}","ElectronicWallet/UserWallets/{DigiCurrency}","ElectronicWallet/Withdrawals/{DigiCurrency}","Notification/Messages","Notification/Messages/{ID}","Trade/Orders","Trade/StopOrders"],put:["Account/CorporateData","Account/DocumentID","Account/DocumentInformation","Account/Email","Account/PersonalInformation","Account/Phone","Account/Questionnaire","Account/ReferredCode","Account/ResidentInformation","Account/SecuritySettings","Account/User","Bank/UserAccounts","ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}","ElectronicWallet/UserWallets/{DigiCurrency}","Info/ReferenceCurrency","Info/ReferenceLanguage"],delete:["APIKey/APIKey/{PublicKey}","Bank/Transactions/{RequestID}","Bank/UserAccounts/{Currency}/{Label}","ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}","ElectronicWallet/UserWallets/{DigiCurrency}/{AddressName}","Trade/Orders","Trade/Orders/{OrderID}","Trade/StopOrders","Trade/StopOrders/{ID}"]}},fees:{trading:{maker:.0025,taker:.0035}},commonCurrencies:{BCP:"BCPT",FLI:"FLIXX",MAN:"MANA",SLT:"SALT",TRA:"TRAC",WGS:"WINGS"},exceptions:{1005:s,1008:a,1057:n,1044:a,1054:a}})}async fetchMarkets(){let e=(await this.publicGetReferenceCurrencyPairs()).currencyPairs,t=[];for(let r=0;r<e.length;r++){let i=e[r],s=i.tradingCode,a=i.baseCurrency,n=i.quoteCurrency,c=this.commonCurrencyCode(a),o=this.commonCurrencyCode(n),d=c+"/"+o,l={amount:8,price:i.priceDecimalPlaces},u={amount:{min:Math.pow(10,-l.amount),max:void 0},price:{min:Math.pow(10,-l.amount),max:void 0},cost:{min:void 0,max:void 0}};t.push({id:s,symbol:d,base:c,quote:o,baseId:a,quoteId:n,active:!0,precision:l,limits:u,info:i})}return t}async fetchBalance(e={}){await this.loadMarkets();let t=(await this.privateGetBalanceBalances()).balances,r={info:t};for(let e=0;e<t.length;e++){let i=t[e],s=i.currency,a=s;s in this.currencies_by_id&&(a=this.currencies_by_id[s].code);let n={free:i.availableBalance,used:this.sum(i.pendingIncoming,i.pendingOutgoing,i.openOrder),total:i.balance};r[a]=n}return this.parseBalance(r)}async fetchOrderBook(e,t,r={}){await this.loadMarkets();let i=this.market(e),s=await this.publicGetPublicMarketDepthCurrencyPair(this.extend({CurrencyPair:i.id},r));return this.parseOrderBook(s,void 0,"bids","asks","price","volume")}async fetchOrder(e,t,r={}){await this.loadMarkets();let i=await this.privateGetTradeOrdersOrderID(this.extend({OrderID:e},r));return this.parseOrder(i.order)}parseTicker(e,t){let r=1e3*parseInt(e.createDateTime),i=void 0;t&&(i=t.symbol);let s=this.safeFloat(e,"volume"),a=this.safeFloat(e,"vwap"),n=s*a,c=this.safeFloat(e,"last");return{symbol:i,timestamp:r,datetime:this.iso8601(r),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"bid"),bidVolume:void 0,ask:this.safeFloat(e,"ask"),askVolume:void 0,vwap:a,open:this.safeFloat(e,"open"),close:c,last:c,previousClose:void 0,change:void 0,percentage:void 0,average:void 0,baseVolume:s,quoteVolume:n,info:e}}async fetchTickers(e,t={}){await this.loadMarkets();let r=(await this.publicGetPublicLiveTickers(t)).tickers,i={};for(let e=0;e<r.length;e++){let t=r[e],s=t.currencyPair,a=this.markets_by_id[s];i[a.symbol]=this.parseTicker(t,a)}return i}async fetchTicker(e,t={}){await this.loadMarkets();let r=this.market(e),i=(await this.publicGetPublicLiveTickerCurrencyPair(this.extend({CurrencyPair:r.id},t))).ticker;return this.parseTicker(i,r)}parseTrade(e,t){let r=void 0,i=void 0;if("way"in e){r="bid"===e.way?"buy":"sell";let t=e.way+"OrderId";i=this.safeString(e,t)}let s=1e3*parseInt(e.transactionTime);if(void 0===t){let r=this.safeString(e,"currencyPair");void 0!==r&&(t=this.findMarket(r))}let a=void 0,n=this.safeFloat(e,"feeAmount"),c=e.price,o=e.quantity,d=c*o,l=void 0,u=void 0;return void 0!==t&&(u=t.symbol,l=t.quote),void 0!==n&&(a={cost:n,currency:l,rate:this.safeFloat(e,"feeRate")}),{info:e,id:this.safeString(e,"transactionId"),order:i,timestamp:s,datetime:this.iso8601(s),symbol:u,type:void 0,side:r,price:c,amount:o,cost:d,fee:a}}async fetchTrades(e,t,r,i={}){await this.loadMarkets();let s=this.market(e),a=await this.publicGetPublicTransactionsCurrencyPair(this.extend({CurrencyPair:s.id},i));return this.parseTrades(a.transactions,s,t,r)}parseOHLCV(e,t,r="1m",i,s){return[1e3*parseInt(e.createDateTime),e.open,e.high,e.low,void 0,e.volume]}async fetchOHLCV(e,t="1m",r,i,s={}){await this.loadMarkets();let a=this.market(e),n={CurrencyPair:a.id,Timeframe:this.timeframes[t]};void 0!==i&&(n.Count=i),n=this.extend(n,s);let c=await this.publicGetPublicTickerHistoryCurrencyPairTimeframe(n),o=this.parseOHLCVs(c.tickers,a,t,r,i);return this.sortBy(o,0)}async createOrder(e,t,i,s,a,n={}){await this.loadMarkets();let c={Code:this.marketId(e),Way:"buy"===i?"Bid":"Ask",Amount:s};if("limit"===t&&(c.Price=a),this.twofa){if(!("ValidationCode"in n))throw new r(this.id+" two-factor authentication requires a missing ValidationCode parameter");c.ValidationCode=n.ValidationCode}let o=await this.privatePostTradeOrders(this.extend(c,n));return{info:o,status:"open",id:this.safeString(o,"clOrderId")}}async cancelOrder(e,t,r={}){return await this.loadMarkets(),await this.privateDeleteTradeOrdersOrderID({OrderID:e})}parseOrderStatus(e){const t={1:"open",2:"open",4:"canceled",6:"closed"};return e in t?t[e]:e}parseOrder(e,t){let r=0===e.side?"buy":"sell",i=0===e.type?"limit":"market",s=void 0;if(void 0===t){let r=this.safeString(e,"code");r in this.markets_by_id&&(t=this.markets_by_id[r])}void 0!==t&&(s=t.symbol);let a=1e3*parseInt(e.date),n=e.initialQuantity,c=e.remainingQuantity,o=n-c,d=e.price,l=d*o,u=e.clOrderId,h=this.parseOrderStatus(this.safeString(e,"status")),m=void 0,p=void 0;if("closed"===h){let t=void 0,r=void 0;m=[];let i=this.safeValue(e,"trades"),s=void 0,a=void 0,n=void 0;if(void 0!==i&&Array.isArray(i)){for(let e=0;e<i.length;e++){let c=this.parseTrade(i[e]);void 0===t&&(t=0),void 0===r&&(r=0),t+=c.amount,r+=c.amount*c.price,"fee"in c&&(void 0!==c.fee.cost&&(void 0===s&&(s=0),s+=c.fee.cost),a=c.fee.currency,void 0!==c.fee.rate&&(void 0===n&&(n=0),n+=c.fee.rate)),m.push(c)}if(void 0!==t&&t>0&&(d=r/t),void 0!==n){let e=m.length;e>0&&(n/=e)}void 0!==s&&(p={cost:s,currency:a,rate:n})}}return{id:u,datetime:this.iso8601(a),timestamp:a,lastTradeTimestamp:void 0,status:h,symbol:s,type:i,side:r,price:d,amount:n,filled:o,remaining:c,cost:l,trades:m,fee:p,info:e}}async fetchOpenOrders(e,t,r,i={}){await this.loadMarkets();let s=await this.privateGetTradeOrders(),a=this.parseOrders(s.orders,void 0,t,r);return void 0!==e?this.filterBySymbol(a,e):a}sign(e,t="public",r="GET",i={},s,a){let n=this.urls.api+"/"+this.implodeParams(e,i),c=this.omit(i,this.extractParams(e));if("public"===t)Object.keys(c).length&&(n+="?"+this.urlencode(c));else{this.checkRequiredCredentials();let e=this.nonce(),t=e.toString(),c="GET"===r?"":"application/json",o=r+n+c+t;o=o.toLowerCase();let d=this.hmac(this.encode(o),this.encode(this.secret),"sha256","base64");s={API_PUBLIC_KEY:this.apiKey,API_REQUEST_SIGNATURE:this.decode(d),API_REQUEST_DATE:t},"GET"!==r&&(s["Content-Type"]=c,a=this.json(this.extend({nonce:e},i)))}return{url:n,method:r,body:a,headers:s}}async withdraw(e,t,r,i,s={}){this.checkAddress(r),await this.loadMarkets();let a={DigiCurrency:this.currency(e).id,Address:r,Amount:t},n=await this.privatePostElectronicWalletWithdrawalsDigiCurrency(this.extend(a,s));return{info:n,id:this.safeString(n,"id")}}async fetchDepositAddress(e,t={}){await this.loadMarkets();let r={DigiCurrency:this.currency(e).id},s=await this.privateGetElectronicWalletDepositWalletsDigiCurrency(this.extend(r,t)),a=s.addresses;if(a.length<1)throw new i(this.id+" privateGetElectronicWalletDepositWalletsDigiCurrency() returned no addresses");let n=this.safeString(a[0],"address");return this.checkAddress(n),{currency:e,address:n,status:"ok",info:s}}async createDepositAddress(e,t={}){await this.loadMarkets();let r={DigiCurrency:this.currency(e).id},i=await this.privatePostElectronicWalletDepositWalletsDigiCurrency(this.extend(r,t)),s=i.address;return this.checkAddress(s),{currency:e,address:s,status:"ok",info:i}}async createUserWallet(e,t,r,i,s={}){await this.loadMarkets();let a={DigiCurrency:this.currency(e).id,AddressName:r,Address:t,Password:i};return{status:"ok",info:await this.privatePostElectronicWalletUserWalletsDigiCurrency(this.extend(a,s))}}handleErrors(e,r,i,s,a,n){if("string"==typeof n&&!(n.length<2)){if(n.indexOf("You are not authorized")>=0)throw new c(n);if("{"===n[0]){let e=JSON.parse(n);if("responseStatus"in e){let r=this.safeString(e.responseStatus,"errorCode"),i=this.safeString(e.responseStatus,"message");const s=this.id+" "+n;if(void 0!==r){const e=this.exceptions;if(r in e)throw new e[r](s);throw new t(s)}if(void 0!==i&&"OK"!==i)throw new t(s)}}}}};
//# sourceMappingURL=gatecoin.js.map