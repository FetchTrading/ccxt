"use strict";const e=require("ololog"),r=(require("ansicolor").nice,require("chai")),t=(r.expect,r.assert),o=require("./test.order.js");module.exports=(async(r,s)=>{if(r.has.fetchOpenOrders){let n=await r.fetchOpenOrders(s);t(n instanceof Array),e("fetched",n.length.toString().green,"open orders");let i=Date.now();for(let e=0;e<n.length;e++){let c=n[e];o(r,c,s,i),t("open"===c.status)}}else e("fetching open orders not supported")});
//# sourceMappingURL=test.fetchOpenOrders.js.map