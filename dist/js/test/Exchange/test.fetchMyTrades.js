"use strict";const e=require("ololog"),t=(require("ansicolor").nice,require("chai")),r=(t.expect,t.assert),s=require("./test.trade.js");module.exports=(async(t,a)=>{if(t.has.fetchMyTrades){let i=await t.fetchMyTrades(a,0);r(i instanceof Array),e("fetched",i.length.toString().green,"trades");let o=Date.now();for(let e=0;e<i.length;e++)s(t,i[e],a,o),e>0&&r(i[e].timestamp>=i[e-1].timestamp)}else e("fetching my trades not supported")});
//# sourceMappingURL=test.fetchMyTrades.js.map