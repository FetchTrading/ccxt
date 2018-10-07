"use strict";const e=require("./liqui.js"),{ExchangeError:s,InsufficientFunds:t,OrderNotFound:i,DDoSProtection:r}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"wex",name:"WEX",countries:"NZ",version:"3",has:{CORS:!1,fetchTickers:!0,fetchDepositAddress:!0},urls:{logo:"https://user-images.githubusercontent.com/1294454/30652751-d74ec8f8-9e31-11e7-98c5-71469fcef03e.jpg",api:{public:"https://wex.nz/api",private:"https://wex.nz/tapi"},www:"https://wex.nz",doc:["https://wex.nz/api/3/docs","https://wex.nz/tapi/docs"],fees:"https://wex.nz/fees"},api:{public:{get:["info","ticker/{pair}","depth/{pair}","trades/{pair}"]},private:{post:["getInfo","Trade","ActiveOrders","OrderInfo","CancelOrder","TradeHistory","TransHistory","CoinDepositAddress","WithdrawCoin","CreateCoupon","RedeemCoupon"]}},fees:{trading:{maker:.002,taker:.002},funding:{withdraw:{BTC:.001,LTC:.001,NMC:.1,NVC:.1,PPC:.1,DASH:.001,ETH:.003,BCH:.001,ZEC:.001}}},exceptions:{messages:{"bad status":i,"Requests too often":r,"not available":r,"external service unavailable":r}},commonCurrencies:{RUR:"RUB"}})}parseTicker(e,s){let t=1e3*e.updated,i=void 0;s&&(i=s.symbol);let r=this.safeFloat(e,"last");return{symbol:i,timestamp:t,datetime:this.iso8601(t),high:this.safeFloat(e,"high"),low:this.safeFloat(e,"low"),bid:this.safeFloat(e,"sell"),bidVolume:void 0,ask:this.safeFloat(e,"buy"),askVolume:void 0,vwap:void 0,open:void 0,close:r,last:r,previousClose:void 0,change:void 0,percentage:void 0,average:this.safeFloat(e,"avg"),baseVolume:this.safeFloat(e,"vol_cur"),quoteVolume:this.safeFloat(e,"vol"),info:e}}async fetchDepositAddress(e,s={}){let t={coinName:this.commonCurrencyCode(e)},i=await this.privatePostCoinDepositAddress(this.extend(t,s));return{currency:e,address:i.return.address,tag:void 0,status:"ok",info:i}}handleErrors(e,i,r,o,a,n){if(200===e){if("{"!==n[0])return;let e=JSON.parse(n);if("success"in e&&!e.success){const i=this.safeString(e,"error");if(!i)throw new s(this.id+" returned a malformed error: "+n);if("no orders"===i)return;const r=this.id+" "+this.json(e),o=this.exceptions.messages;if(i in o)throw new o[i](r);throw i.indexOf("It is not enough")>=0?new t(r):new s(r)}}}};
//# sourceMappingURL=wex.js.map