"use strict";const e=require("ololog"),r=(require("ansicolor").nice,require("chai")),o=(r.expect,r.assert,require("./test.orderbook.js"));module.exports=(async(r,t)=>{const s="fetchL2OrderBook";if(r.has[s]){let e=await r[s](t);return o(r,e,s,t),e}e(s+"() not supported")});
//# sourceMappingURL=test.fetchL2OrderBook.js.map