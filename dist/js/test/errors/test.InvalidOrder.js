"use strict";const e=require("ololog"),r=(require("ansicolor").nice,require("chai")),t=require("../../../ccxt.js"),i=(r.expect,r.assert);module.exports=(async(r,a)=>{if(r.has.createOrder)try{await r.createLimitBuyOrder(a,0,0),i.fail()}catch(r){if(r instanceof t.InvalidOrder)return void e("InvalidOrder thrown as expected");throw e("InvalidOrder failed, exception follows:"),r}else e("createOrder not supported")});
//# sourceMappingURL=test.InvalidOrder.js.map