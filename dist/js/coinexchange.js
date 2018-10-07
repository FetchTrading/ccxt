"use strict";const e=require("./base/Exchange"),{ExchangeError:t}=require("./base/errors");module.exports=class extends e{describe(){return this.deepExtend(super.describe(),{id:"coinexchange",name:"CoinExchange",countries:["IN","JP","KR","VN","US"],rateLimit:1e3,has:{privateAPI:!1,createOrder:!1,createMarketOrder:!1,createLimitOrder:!1,cancelOrder:!1,editOrder:!1,fetchTrades:!1,fetchOHLCV:!1,fetchCurrencies:!0,fetchTickers:!0},urls:{logo:"https://user-images.githubusercontent.com/1294454/34842303-29c99fca-f71c-11e7-83c1-09d900cb2334.jpg",api:"https://www.coinexchange.io/api/v1",www:"https://www.coinexchange.io",doc:"https://coinexchangeio.github.io/slate/",fees:"https://www.coinexchange.io/fees"},api:{public:{get:["getcurrency","getcurrencies","getmarkets","getmarketsummaries","getmarketsummary","getorderbook"]}},fees:{trading:{maker:.0015,taker:.0015},funding:{withdraw:{1337:.01,"420G":.01,611:.1,ACC:.01,ACES:.01,ACO:.01,ACP:.01,ADCN:500,ADST:1,ADZ:.1,AGRI:.01,AI:1,AKY:.01,ALIS:1,ALL:.2,AMC:.1,AMMO:.01,AMS:.01,ANTX:.01,ANY:1,ARG:.1,ARGUS:.01,ARGUSOLD:.01,ASN:.01,ATOM:.01,ATX:.01,AU:.01,B2B:1,B3:.01,BAKED:.01,BCC:.01,BCH:.001,BCM:.01,BDL:.01,BEER:.01,BELA:.01,BENJI:.05,BET:.01,BFI:1,BIGUP:1,BIRDS:.01,BITB:.1,BIXC:.01,BIZ:.01,BLAS:.1,BLAZR:.2,BLK:.01,BLN:1,BLUE:1,BOAT:1,BON:.01,BONPAY:1,BOPS:.01,BPOK:.1,BQ:1,BRAT:.01,BRC:1,BRIT:.01,BSN:1,BSR:.01,BTBc:.01,BTC:.001,BTCRED:1,BTCRF:.01,BTDX:.1,BTE:1,BTPL:.01,BULLS:.01,BUZZ:.01,BXT:.01,C47:1,CACH:.2,CALC:.01,CANN:.01,CBANK:1,CDX:1,CHEAP:.01,CHESS:.01,CHILI:.01,CHIPS:.1,CJ:.1,CLT:.1,CMPCO:.2,CMX:.01,CNNC:.02,CNT:.01,CO2:1,COOC:.01,COUPE:.01,CQST:.1,CRACKERS:.01,CRDNC:.01,CREA:.02,CREAK:.01,CREVA2:.01,CRMSN:.01,CRN:.01,CRW:.01,CTIC2:.01,CUBE:.01,CXT:.01,CYCLONE:.01,CYDER:.01,DAG:.01,DALC:1,DARI:.01,DASH:.01,DAV:.01,DBIC:.1,DCN:1,DEM:.01,DFS:.01,DGB:.1,DGC:.1,DIME:.01,DMB:.01,DMC:.1,DNCV2:.01,DNE:1,DNR:.01,DOGE:2,DOGEJ:1,DP:.01,DRGN:1,DRS:.1,DSE:.01,DSR:.01,DTCT:1,DUTCH:.01,EBC:.01,EBT:.01,ECC:.1,ECN:.01,EDRC:.01,EECN:.01,EGC:.1,ELCO:.1,ELIX:1,ELS:.01,ELT:1,EMC:.01,EMIRG:.01,ENTRC:1,ENZO:.1,EQL:1,EQT:.1,ERSO:.01,ERT:1,ERY:.01,ESP:.1,ETBS:1,ETC:.1,ETG:1,ETH:.01,ETHD:.01,ETHOS:1,ETN:2,EUROP:.1,EXCL:.1,EXTN:.01,FAIR:.01,FAP:1,FAZZ:.01,FCH:.01,FGZ:.1,FLASH:.01,FLIK:1,FRT:.1,FSX:.1,FTC:.01,FXE:2,GAIN:1,GB:.1,GBX:.01,GDC:1,GEERT:.01,GET:.01,GFC:1,GLS:.01,GLT:.01,GLTC:.01,GMB:.01,GMX:.01,GOKUOLD:.1,GOLD:.01,GOLF:.1,GOOD:2,GP:.01,GRE:.01,GREENF:.01,GRMD:1,GRS:.01,GRX:1,GTC:.01,GWC:.2,HALLO:.01,HBC:.01,HC:.01,HEALTHY:.01,HIGH:.01,HarmonyCoin:.01,HNC:.01,HOC:.01,HODL:.01,HOLLY:1,HONEY:.01,HOPE:.01,HPC:.01,HUB:1,HYP:.01,HYPER:.01,IBC:1,ICE:1,ICOT:1,IFT:1,ILC:.01,IMX:.01,INDIA:.01,INFO:.01,INSN:.01,INXT:1,IOE:.01,IQT:1,IXC:.01,JAPAN:.01,JEDI:.01,JET:1,JIN:.2,KAYI:.01,KB3:.01,KGB:.01,KLC:.1,KMD:.01,KOBO:1,KOI:.01,KORUNA:.1,KRA:.01,KUBO:.01,KURT:.01,LA:1,LAMBO:.01,LCT:1,LDC:.01,LEVO:.1,LIFE:1,LINDA:.01,LINX:.01,LIZ:.01,LMC:.1,LNK:.05,LRC:1,LTC:.01,LTG:1,LUCK:.01,LUNA:.01,LVPS:.01,MAC:2,MAG:.01,MALC:.01,MARS:.01,MARS2:.01,MAXI:.01,MAY:.01,MBC:.01,MBIT:.01,MCB:1,MEC:.1,MENTAL:.1,MER:.1,MET:.01,MGM:.01,MGT:.01,MILO:.5,MINEX:1,MINT:1,MIPS:1,MNX:.01,MOIN:.1,MOON:.1,MSCN:.01,MSP:1,MST:.1,MTH:1,MUE:.1,MUX:1,MXC:.01,MXT:.1,MYB:1,NBIT:.1,NBX:.01,NEOG:1,NEON:.01,NLC2:.01,NLG:.1,NRN:.01,NRO:.01,NTC:1,NTO:1,NUA:1,NUMUS:.01,OC:.01,OGN:.01,ORO:.01,PARIS:.01,PAYU:.1,PCN:1,PCS:.01,PDG:.01,PEC:.01,PGL:1,PHN:1,PICO:.1,PIE:.01,PIGGY:.1,PIVX:.2,PIX:1,PKT:1,PLACO:.01,PLX:1,POL:.01,POLOB:.1,POS:1,POST:1,POSW:.01,POT:.1,PRE:1,PRIMU:.01,PRL:1,PRN:1,PRX:.01,PT:1,PTS:1,PURA:1,PURE:.01,PUT:.1,PWC:.01,PWR:.1,QTUM:.01,QUANT:.01,RAIN:.5,RBL:.01,RDC:.01,REC:.01,REGA:.1,REX:1,RHO:.1,RIYA:1,RMC:2,RNS:.01,ROC:0,ROOFS:.01,RUB:.01,RUNE:.01,RUNNERS:.01,RUP:.01,SBIT:.01,SCL:1,SCORE:.01,SCOREOLD:.01,SDASH:.01,SFC:.01,SFE:.01,SGR:1,SHIT:.1,SHM:.1,SHND:.1,SHOT:.1,SIC:.1,SILK2:.01,SIMP:.001,SISA:1,SKOIN:.01,SKULL:.01,SLEVIN:.01,SLR:.01,SMART:.01,SMS:.002,SNOW:.01,SOLAR:.01,SPRTS:1,SRC:.01,SST:.1,STARS:.01,STN:.01,STO:.01,STX:1,SUPER:.01,SUPERMAN:.01,SURGE:.01,SWC:.1,SYNQ:.01,SYNX:.01,TAAS:2,TBS:.01,TCOIN:.01,TELL:.1,TER:.005,TGT:1,TIGER:.01,TIPS:.01,TLE:.01,TOPAZ:.01,TOR:.01,TPC:.01,TPG:.01,TPI:1,TRANCE:.01,TRC:.01,TRUX:.01,TSE:.1,TSTR:.01,TURBO:.01,UFO:.01,UK:.01,ULA:.01,UNIFY:0,UNIT:.1,UNO:.001,UP:.01,UQC:1,USA:.01,VC:.01,VGS:.01,VIDZ:.01,VISIO:.05,VLTC:.1,VOISE:1,VONE:.01,VOX:.01,VSX:.01,VULCANO:.01,WASH:.1,WCL:1,WINK:.01,WOMEN:.01,WORM:.01,WOW:.1,WRP:.01,WYV:.01,XBC:.01,XBL:1,XBU:1,XCHE:.1,XCS:.01,XCT:.01,XCXT:.01,XDE2:.01,XEV:.1,XGOX:.01,XGTC:.01,XLR:.1,XMCC:.01,XP:1,XPASC:.01,XQN:.01,XSA:.1,XSTC:2,XTD:.01,XVS:.01,XXX:.1,XYOC:1,XYZ:.01,XZC:.1,XZCD:.01,YHC:.01,ZCC:.01,ZCG:1,ZCL:.001,ZEC:.001,ZEIT:.1,ZENI:.01,ZERO:.01,ZMC:.1,ZOI:.01,ZSE:.01,ZURMO:.1,ZZC:.01}}},precision:{amount:8,price:8},commonCurrencies:{BON:"BonPeKaO",ETN:"Ethernex",GET:"GreenEnergyToken",GDC:"GoldenCryptoCoin",GTC:"GlobalTourCoin",HMC:"HarmonyCoin",HNC:"Huncoin",MARS:"MarsBux",MER:"TheMermaidCoin",RUB:"RubbleCoin",UP:"UpscaleToken"}})}async fetchCurrencies(e={}){let t=(await this.publicGetGetcurrencies(e)).result,C=this.precision.amount,i={};for(let e=0;e<t.length;e++){let r=t[e],s=r.CurrencyID,a=this.commonCurrencyCode(r.TickerCode),o="online"===r.WalletStatus,T="ok";o||(T="disabled"),i[a]={id:s,code:a,name:r.Name,active:o,status:T,precision:C,limits:{amount:{min:void 0,max:Math.pow(10,C)},price:{min:Math.pow(10,-C),max:Math.pow(10,C)},cost:{min:void 0,max:void 0},withdraw:{min:void 0,max:Math.pow(10,C)}},info:r}}return i}async fetchMarkets(){let e=(await this.publicGetGetmarkets()).result,t=[];for(let C=0;C<e.length;C++){let i=e[C],r=i.MarketID,s=this.commonCurrencyCode(i.MarketAssetCode),a=this.commonCurrencyCode(i.BaseCurrencyCode),o=s+"/"+a;t.push({id:r,symbol:o,base:s,quote:a,baseId:i.MarketAssetID,quoteId:i.BaseCurrencyID,active:i.Active,lot:void 0,info:i})}return t}parseTicker(e,t){let C=void 0;if(!t){let i=e.MarketID;i in this.markets_by_id?t=this.markets_by_id[i]:C=i}t&&(C=t.symbol);let i=this.milliseconds(),r=this.safeFloat(e,"LastPrice");return{symbol:C,timestamp:i,datetime:this.iso8601(i),high:this.safeFloat(e,"HighPrice"),low:this.safeFloat(e,"LowPrice"),bid:this.safeFloat(e,"BidPrice"),bidVolume:void 0,ask:this.safeFloat(e,"AskPrice"),askVolume:void 0,vwap:void 0,open:void 0,close:r,last:r,previousClose:void 0,change:this.safeFloat(e,"Change"),percentage:void 0,average:void 0,baseVolume:void 0,quoteVolume:this.safeFloat(e,"Volume"),info:e}}async fetchTicker(e,t={}){await this.loadMarkets();let C=this.market(e),i=await this.publicGetGetmarketsummary(this.extend({market_id:C.id},t));return this.parseTicker(i.result,C)}async fetchTickers(e,t={}){await this.loadMarkets();let C=(await this.publicGetGetmarketsummaries(t)).result,i={};for(let e=0;e<C.length;e++){let t=this.parseTicker(C[e]);i[t.symbol]=t}return i}async fetchOrderBook(e,t,C={}){await this.loadMarkets();let i=await this.publicGetGetorderbook(this.extend({market_id:this.marketId(e)},C));return this.parseOrderBook(i.result,void 0,"BuyOrders","SellOrders","Price","Quantity")}sign(e,t="public",C="GET",i={},r,s){let a=this.urls.api+"/"+e;return"public"===t&&(i=this.urlencode(i)).length&&(a+="?"+i),{url:a,method:C,body:s,headers:r}}async request(e,C="public",i="GET",r={},s,a){let o=await this.fetch2(e,C,i,r,s,a);if(1!==this.safeInteger(o,"success")){let e=this.safeString(o,"message","Error");throw new t(e)}return o}};
//# sourceMappingURL=coinexchange.js.map