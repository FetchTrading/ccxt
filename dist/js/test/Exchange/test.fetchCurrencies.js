"use strict";const e=require("ololog"),r=(require("ansicolor").nice,require("chai")),c=(r.expect,r.assert,require("./test.currency.js"));module.exports=(async r=>{if([].includes(r.id))e(r.id,"found in ignored exchanges, skipping fetchCurrencies...");else{if(r.has.fetchCurrencies){const e="fetchCurrencies",i=await r[e]();return Object.values(i).forEach(i=>c(r,i,e)),i}e("fetching currencies not supported")}});
//# sourceMappingURL=test.fetchCurrencies.js.map