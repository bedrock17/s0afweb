!function(t){function e(e){for(var n,o,s=e[0],c=e[1],l=e[2],f=0,h=[];f<s.length;f++)o=s[f],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&h.push(r[o][0]),r[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);for(u&&u(e);h.length;)h.shift()();return i.push.apply(i,l||[]),a()}function a(){for(var t,e=0;e<i.length;e++){for(var a=i[e],n=!0,s=1;s<a.length;s++){var c=a[s];0!==r[c]&&(n=!1)}n&&(i.splice(e--,1),t=o(o.s=a[0]))}return t}var n={},r={app:0},i=[];function o(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.e=function(t){var e,a=[],n=r[t];if(0!==n)if(n)a.push(n[2]);else{var i=new Promise((function(e,a){n=r[t]=[e,a]}));a.push(n[2]=i);var s,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=o.p+"js/"+({about:"about"}[e=t]||e)+"."+{about:"ad801997"}[e]+".js";var l=new Error;s=function(e){c.onerror=c.onload=null,clearTimeout(u);var a=r[t];if(0!==a){if(a){var n=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;l.message="Loading chunk "+t+" failed.\n("+n+": "+i+")",l.name="ChunkLoadError",l.type=n,l.request=i,a[1](l)}r[t]=void 0}};var u=setTimeout((function(){s({type:"timeout",target:c})}),12e4);c.onerror=c.onload=s,document.head.appendChild(c)}return Promise.all(a)},o.m=t,o.c=n,o.d=function(t,e,a){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(a,n,function(e){return t[e]}.bind(null,n));return a},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/static/",o.oe=function(t){throw console.error(t),t};var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var u=c;i.push([0,"chunk-vendors"]),a()}({0:function(t,e,a){t.exports=a("cd49")},1373:function(t,e,a){"use strict";var n=a("5b8e");a.n(n).a},"2a99":function(t,e,a){"use strict";var n=a("cd92");a.n(n).a},"5b8e":function(t,e,a){},"5c0b":function(t,e,a){"use strict";var n=a("9c0c");a.n(n).a},"5f34":function(t,e,a){},"7b92":function(t,e,a){"use strict";var n=a("d4ec"),r=a("99de"),i=a("7e84"),o=a("262e"),s=a("9ab4"),c=a("60a3"),l=function(t){function e(){var t;return Object(n.a)(this,e),(t=Object(r.a)(this,Object(i.a)(e).apply(this,arguments))).RankList=[],t}return Object(o.a)(e,t),e}(c.c);Object(s.a)([Object(c.b)({default:[]})],l.prototype,"RankList",void 0);var u=l=Object(s.a)([c.a],l),f=(a("8635"),a("2877")),h=Object(f.a)(u,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"Rank"},[t.RankList&&0<t.RankList.length?a("div",[a("h1",[t._v(" RANK ")]),a("div",[a("table",{staticClass:"table"},[t._m(0),a("tbody",t._l(t.RankList,(function(e,n){return a("tr",{key:n},[a("td",{staticClass:"name"},[t._v(" "+t._s(e.UserName))]),a("td",[t._v(" "+t._s(e.Score))]),a("td",[t._v(" "+t._s(e.TouchCount))]),a("td",[t._v(" "+t._s((""+e.Score/e.TouchCount).substring(0,5)))])])})),0)])])]):t._e()])}),[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("thead",{staticClass:"thead-dark"},[a("tr",[a("th",[t._v("Name")]),a("th",[t._v("Score")]),a("th",[t._v("Touch")]),a("th",[t._v("Score/Touch")])])])}],!1,null,"1d864f57",null);e.a=h.exports},8635:function(t,e,a){"use strict";var n=a("f328");a.n(n).a},"9c0c":function(t,e,a){},c291:function(t,e,a){"use strict";var n=a("5f34");a.n(n).a},cd49:function(t,e,a){"use strict";a.r(e),a("e260"),a("e6cf"),a("cca6"),a("a79d");var n,r,i=a("2b0e"),o=(a("5c0b"),a("2877")),s=Object(o.a)({},(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)}),[],!1,null,null,null).exports,c=(a("d3b7"),a("8c4f")),l=(a("b0c0"),a("25f0"),a("d4ec")),u=a("bee2"),f=a("99de"),h=a("7e84"),v=a("262e"),p=a("9ab4"),m=a("7b92"),d=a("60a3"),b=a("bc3a"),g=a.n(b),k=(a("96cf"),a("1da1")),j=["(255, 255, 255)","(0, 171, 255)","(255, 171, 0)","(0, 255, 171)"],y={};function O(t){return new Promise((function(e){return setTimeout(e,t)}))}var x=function(){function t(){var e=this;Object(l.a)(this,t),this.proc=function(t){if(null!=n){var a,r,i=(a=t,r=n.getBoundingClientRect(),{x:a.clientX-r.left,y:a.clientY-r.top}),o=i.x,s=i.y,c=Math.floor(o/31),l=Math.floor(s/31);15<=l||8<=c||0!=y[l][c]&&(e.lastPos={y:l,x:c})}},this.score=0,this.touchcount=0,this.gameOver=!1,this.handleInit=!1,this.gameOverCallback=null,this.lastPos={y:-1,x:-1},this.dropEffect=!0,this.deleteEffect=!0}var e,a;return Object(u.a)(t,[{key:"draw",value:function(){r.globalAlpha=1,r.fillStyle="rgb(0, 0, 0)",r.fillRect(0,0,800,800),r.globalAlpha=1;for(var t=0;t<15;t++)for(var e=0;e<8;e++){var a=31*t,n=31*e,i=j[y[t][e]];r.fillStyle="rgb"+i,r.fillRect(n,a,31,31)}}},{key:"newBlocks",value:function(){var t,e,a=0,n=0;for(a=0;a<15;a++)for(n=0;n<8;n++){if(0==a){if(0!=y[a][n])return this.gameOver=!0,void(null!=this.gameOverCallback&&this.gameOverCallback())}else y[a-1][n]=y[a][n];14==a&&(y[a][n]=(t=1,e=3,Math.floor(Math.random()*(e-t+1))+t))}}},{key:"gameProcLoop",value:(a=Object(k.a)(regeneratorRuntime.mark((function t(){var e,a,n,r,i,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=!1,t.next=3,O(100);case 3:if(this.gameOver){t.next=32;break}return t.next=6,O(50);case 6:if(0<=this.lastPos.x&&0<=this.lastPos.y)return t.next=9,this.deleteblock({i:this.lastPos.y,j:this.lastPos.x},y[this.lastPos.y][this.lastPos.x],1);t.next=14;break;case 9:a=t.sent,this.touchcount+=1,this.score+=a*a,this.lastPos={y:-1,x:-1},e=!0;case 14:r=!(n=!1);case 16:if(!r){t.next=23;break}for(r=!1,i=14;0<i;i--)for(o=0;o<8;o++)0==y[i][o]&&0!=y[i-1][o]&&(y[i][o]=y[i-1][o],y[i-1][o]=0,r=n=!0);if(this.dropEffect)return t.abrupt("break",23);t.next=21;break;case 21:t.next=16;break;case 23:if(n&&this.draw(),e)return this.newBlocks(),e=!1,this.draw(),t.next=30,O(100);t.next=30;break;case 30:t.next=3;break;case 32:case"end":return t.stop()}}),t,this)}))),function(){return a.apply(this,arguments)})},{key:"deleteblock",value:(e=Object(k.a)(regeneratorRuntime.mark((function t(e,a,n){var r,i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=1,i={i:0,j:0},y[e.i][e.j]=0,this.deleteEffect)return this.draw(),t.next=7,O(50);t.next=7;break;case 7:if(0!=e.i&&y[e.i-1][e.j]==a)return i.i=e.i-1,i.j=e.j,t.t0=r,t.next=13,this.deleteblock(i,a,n+1);t.next=14;break;case 13:r=t.t0+=t.sent;case 14:if(7!=e.j&&y[e.i][e.j+1]==a)return i.i=e.i,i.j=e.j+1,t.t1=r,t.next=20,this.deleteblock(i,a,n+1);t.next=21;break;case 20:r=t.t1+=t.sent;case 21:if(14!=e.i&&y[e.i+1][e.j]==a)return i.i=e.i+1,i.j=e.j,t.t2=r,t.next=27,this.deleteblock(i,a,n+1);t.next=28;break;case 27:r=t.t2+=t.sent;case 28:if(0!=e.j&&y[e.i][e.j-1]==a)return i.i=e.i,i.j=e.j-1,t.t3=r,t.next=34,this.deleteblock(i,a,n+1);t.next=35;break;case 34:r=t.t3+=t.sent;case 35:return t.abrupt("return",new Promise((function(t){t(r)})));case 36:case"end":return t.stop()}}),t,this)}))),function(t,a,n){return e.apply(this,arguments)})},{key:"initMAP",value:function(){if(null!=(n=document.getElementById("cvs"))){for(var t=0;t<15;t++){void 0===y[t]&&(y[t]={});for(var e=0;e<8;e++)y[t][e]=0}if(0==this.handleInit){if(r=n.getContext("2d"),null==n)return;n.addEventListener("click",this.proc),r.globalAlpha=.2,r.fillStyle="rgb(0, 171, 255)",r.fillRect(0,0,800,800),r.globalAlpha=1,this.handleInit=!0}this.newBlocks()}}},{key:"startGame",value:function(){this.initMAP(),this.score=0,this.touchcount=0,this.draw(),this.gameOver=!1,this.gameProcLoop()}}]),t}();function _(t){function e(t,e){var a=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(a>>16)<<16|65535&a}function a(t,e){return t>>>e|t<<32-e}function n(t,e){return t>>>e}return function(t){for(var e="0123456789abcdef",a="",n=0;n<4*t.length;n++)a+=e.charAt(t[n>>2]>>8*(3-n%4)+4&15)+e.charAt(t[n>>2]>>8*(3-n%4)&15);return a}(function(t,r){var i,o,s,c,l,u,f,h,v,p,m,d,b,g,k,j,y,O,x=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],_=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],w=new Array(64);t[r>>5]|=128<<24-r%32,t[15+(r+64>>9<<4)]=r;for(var C=0;C<t.length;C+=16){i=_[0],o=_[1],s=_[2],c=_[3],l=_[4],u=_[5],f=_[6],h=_[7];for(var R=0;R<64;R++)w[R]=R<16?t[R+C]:e(e(e(a(O=w[R-2],17)^a(O,19)^n(O,10),w[R-7]),a(y=w[R-15],7)^a(y,18)^n(y,3)),w[R-16]),v=e(e(e(e(h,a(j=l,6)^a(j,11)^a(j,25)),(k=l)&u^~k&f),x[R]),w[R]),p=e(a(g=i,2)^a(g,13)^a(g,22),(m=i)&(d=o)^m&(b=s)^d&b),h=f,f=u,u=l,l=e(c,v),c=s,s=o,o=i,i=e(v,p);_[0]=e(i,_[0]),_[1]=e(o,_[1]),_[2]=e(s,_[2]),_[3]=e(c,_[3]),_[4]=e(l,_[4]),_[5]=e(u,_[5]),_[6]=e(f,_[6]),_[7]=e(h,_[7])}return _}(function(t){for(var e=[],a=0;a<8*t.length;a+=8)e[a>>5]|=(255&t.charCodeAt(a/8))<<24-a%32;return e}(t=function(t){t=t.replace(/\r\n/g,"\n");for(var e="",a=0;a<t.length;a++){var n=t.charCodeAt(a);n<128?e+=String.fromCharCode(n):(127<n&&n<2048?e+=String.fromCharCode(n>>6|192):(e+=String.fromCharCode(n>>12|224),e+=String.fromCharCode(n>>6&63|128)),e+=String.fromCharCode(63&n|128))}return e}(t)),8*t.length))}a("ac1f"),a("5319");var w=function(t){function e(){var t;return Object(l.a)(this,e),(t=Object(f.a)(this,Object(h.a)(e).apply(this,arguments))).game=new x,t.gameStart=!1,t.name="",t.RankList=[],t}return Object(v.a)(e,t),Object(u.a)(e,[{key:"mounted",value:function(){this.game.gameOverCallback=this.gameOverCallback}},{key:"gameOverCallback",value:function(){var t=this;this.RankList=[],g.a.post("/api/poptilerank",{UserName:this.name,Score:this.game.score,TouchCount:this.game.touchcount,Check:_(this.name+(this.game.score+this.game.touchcount).toString())}).then((function(e){t.RankList=e.data.RankList}))}},{key:"startBtnHandle",value:function(){this.game.startGame(),this.gameStart=!0}},{key:"retryGame",value:function(){this.game.startGame()}}]),e}(d.c),C=w=Object(p.a)([Object(d.a)({name:"poptile",components:{Rank:m.a}})],w),R=(a("2a99"),Object(o.a)(C,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"poptile"},[a("b-form-checkbox",{attrs:{name:"check-button",switch:""},model:{value:t.game.dropEffect,callback:function(e){t.$set(t.game,"dropEffect",e)},expression:"game.dropEffect"}},[t._v(" 떨어짐 효과 ")]),a("b-form-checkbox",{attrs:{name:"check-button",switch:""},model:{value:t.game.deleteEffect,callback:function(e){t.$set(t.game,"deleteEffect",e)},expression:"game.deleteEffect"}},[t._v(" 지우는 효과 ")]),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.gameStart,expression:"!gameStart"}]},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"form-control username",attrs:{type:"text",placeholder:"사용자이름",maxlength:"30"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),a("p"),a("input",{staticClass:"btn btn-outline-primary",attrs:{type:"button",value:"START!"},on:{click:t.startBtnHandle}})]),a("div",{directives:[{name:"show",rawName:"v-show",value:t.gameStart,expression:"gameStart"}]},[a("h2",[0<t.name.length?a("span",[t._v(" ["+t._s(t.name)+"] ")]):a("span",[t._v(" "+t._s(t.name)+" ")]),t._v(" SCORE: "+t._s(t.game.score)+" ")]),t.game.gameOver?a("div",[a("h1",[t._v(" GAME OVER ")]),a("h1",{staticClass:"retry",on:{click:t.retryGame}},[t._v(" RETRY? ")]),t._v(" "),a("br")]):t._e(),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.game.gameOver,expression:"!game.gameOver"}]},[a("canvas",{attrs:{id:"cvs",width:"245px",height:"460px"}})])]),t.game.gameOver?a("hr"):t._e(),t.game.gameOver?a("Rank",{attrs:{RankList:t.RankList}}):t._e(),t.gameStart?t._e():a("div",{attrs:{id:"nav"}},[a("router-link",{staticClass:"btn btn-outline-info",attrs:{to:"/poptile/rank"}},[t._v("RANK")])],1)],1)}),[],!1,null,"61e1d2b1",null).exports),P=function(t){function e(){var t;return Object(l.a)(this,e),(t=Object(f.a)(this,Object(h.a)(e).apply(this,arguments))).showHint=!1,t}return Object(v.a)(e,t),Object(u.a)(e,[{key:"toggle",value:function(){this.showHint=!this.showHint}}]),e}(d.c),S=P=Object(p.a)([d.a],P),E=(a("c291"),Object(o.a)(S,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"help"},[a("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle",value:"collapse-1",expression:"'collapse-1'"}],attrs:{variant:"outline-info"}},[t._v("사용법")]),a("b-collapse",{attrs:{id:"collapse-1"}},[a("div",{staticClass:"help-text"},[a("p",[t._v("1. 타일이 최대 높이를 넘으면 게임이 종료됩니다.")]),a("p",[t._v(" 2. 타일을 선택하면 선택된 타일과 인접한 같은 색의 타일이 지워지고 타일이 아래에서 올라옵니다. ")]),a("p",[t._v("3. 이름을 입력하면 이름으로 점수가 등록됩니다.")])])]),a("br")],1)}),[],!1,null,"a84099b6",null).exports),A=function(t){function e(){return Object(l.a)(this,e),Object(f.a)(this,Object(h.a)(e).apply(this,arguments))}return Object(v.a)(e,t),e}(d.c),L=A=Object(p.a)([d.a],A),T=(a("1373"),{name:"Home",components:{Poptile:R,Help:E,UpdateHistory:Object(o.a)(L,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"help"},[a("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle",value:"collapse-2",expression:"'collapse-2'"}],attrs:{variant:"outline-info"}},[t._v("업데이트 히스토리")]),a("b-collapse",{attrs:{id:"collapse-2"}},[a("div",{staticClass:"text-update-log"},[a("h3",[t._v("ver 20.3.12.1")]),a("pre",[t._v("\t지워지는 효과 추가\n\tURI처리 버그 수정\n\t히스토리 추가\n\t문의는 이곳으로 :) https://open.kakao.com/o/g9F8Ym1b\n\t\t\t\t")])])])],1)}),[],!1,null,"af545898",null).exports}}),H=Object(o.a)(T,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"home"},[e("Help"),e("Poptile"),e("UpdateHistory")],1)}),[],!1,null,null,null).exports;i.default.use(c.a);var M=[{path:"/static/index.html",name:"Home",component:H},{path:"/poptile",name:"Home",component:H},{path:"/",name:"Home",component:H},{path:"/poptile/rank",name:"RankPage",component:function(){return a.e("about").then(a.bind(null,"17f1"))}}],N=new c.a({mode:"history",base:"/static/",routes:M}),$=a("a7fe"),B=a.n($),G=a("5f5b"),I=a("b1e0");a("f9e3"),a("2dd8"),i.default.use(B.a,g.a),i.default.config.productionTip=!0,i.default.use(G.a),i.default.use(I.a),new i.default({router:N,render:function(t){return t(s)}}).$mount("#app")},cd92:function(t,e,a){},f328:function(t,e,a){}});