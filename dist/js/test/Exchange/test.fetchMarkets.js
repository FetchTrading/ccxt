"use strict";const e=require("ololog"),t=(require("ansicolor").nice,require("chai")),r=(t.expect,t.assert,require("./test.market.js"));module.exports=(async t=>{if([].includes(t.id))e(t.id,"found in ignored exchanges, skipping fetchMarkets...");else{if(t.has.fetchMarkets){const e="fetchMarkets",s=await t[e]();return Object.values(s).forEach(s=>r(t,s,e)),s}e("fetching markets not supported")}});
//# sourceMappingURL=test.fetchMarkets.js.map