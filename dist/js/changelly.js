"use strict";const t=require("crypto"),e=require("./base/Exchange");module.exports=class s extends e{describe(){return this.deepExtend(super.describe(),{id:"changelly",name:"Changelly",countries:"CHE",version:void 0,userAgent:void 0,rateLimit:1e3,urls:{logo:"https://changelly.com/a052341d96320fbeab6a9d477359a9a2.svg",api:"https://api.changelly.com",www:"https://changelly.com/",doc:["https://info.shapeshift.io/api"]},has:{createLimitOrder:!1,createMarketOrder:!1,createOrder:!1,fetchBalance:!1,fetchCurrencies:!1,fetchL2OrderBook:!1,fetchMarkets:!0,fetchOHLCV:!1,fetchTicker:!1,fetchTrades:!1,privateAPI:!1,startInstantTransaction:!0},api:{public:{post:["createTransaction","getCurrencies","getCurrenciesFull","getExchangeAmount","getMinAmount","getStatus"]}},requiredCredentials:{apiKey:!0,secret:!0}})}static signBody(e,s){return t.createHmac("sha512",s).update(JSON.stringify(e)).digest("hex")}static formRequestBody(t,e){return{id:Math.floor(Math.random()*Math.floor(1e4)),jsonrpc:"2.0",method:t,params:e}}sign(t,e="public",r="POST",a={},o,i){const n=t.includes("/")?t.split("/").shift():t,c=s.formRequestBody(n,a),u={"Content-Type":"application/json","api-key":this.apiKey,sign:s.signBody(c,this.secret)};return{url:this.urls.api,method:r,body:JSON.stringify(c),headers:u}}async instantTransactionStatus(t,e={}){return(await this.publicPostGetStatus({id:t})).result}async startInstantTransaction(t,e,s,r,a={}){const o={from:t.toLowerCase(),to:e.toLowerCase(),address:r,amount:s,extraId:null,refundAddress:r},i=await this.publicPostCreateTransaction(o);if(i.error)throw new Error(i.error.message);const{result:n}=i;return{transactionId:n.id,depositAddress:n.payinAddress,info:i}}async fetchOrderBook(t,e,s={}){await this.loadMarkets();const[r,a]=t.split("/"),[o,i]=await Promise.all([this.publicPostGetExchangeAmount({from:r.toLowerCase(),to:a.toLowerCase(),amount:"1.0"}),this.publicPostGetExchangeAmount({from:a.toLowerCase(),to:r.toLowerCase(),amount:"1.0"})]),n=new Date,c=Number.MAX_SAFE_INTEGER.toString();return{timestamp:n.getTime(),datetime:n.toISOString(),nonce:void 0,bids:[[parseFloat(o.result),c]],asks:[[1/parseFloat(i.result),c]]}}async getMinimums(t){return(await this.publicPostGetMinAmount(t)).result}async fetchMarkets(){const t=(await this.publicPostGetCurrenciesFull()).result,e={},s=[];for(let r=0,a=t.length;r<a;r++){const a=t[r];if(!a.enabled||"eth"===a.name)continue;s.push({from:"eth",to:a.name}),s.push({from:a.name,to:"eth"});const o=a.name.toUpperCase(),i=`${o}/ETH`;e[i]={id:i,symbol:i,base:o,quote:"ETH",active:!0,limits:{amount:{}},info:a};const n=`ETH/${o}`;e[n]={id:n,symbol:n,base:"ETH",quote:o,active:!0,limits:{amount:{}},info:a}}let r=[];try{r=await this.getMinimums(s)}catch(t){console.error(t),r=[]}const a=[];for(let t=0,s=r.length;t<s;t++){const s=r[t],o=`${s.from.toUpperCase()}/${s.to.toUpperCase()}`;e[o].limits.amount.min=s.minAmount,a.push(e[o])}return a}};
//# sourceMappingURL=changelly.js.map