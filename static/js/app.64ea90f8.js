!function(t){function e(e){for(var n,o,s=e[0],c=e[1],l=e[2],h=0,f=[];h<s.length;h++)o=s[h],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&f.push(r[o][0]),r[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);for(u&&u(e);f.length;)f.shift()();return i.push.apply(i,l||[]),a()}function a(){for(var t,e=0;e<i.length;e++){for(var a=i[e],n=!0,s=1;s<a.length;s++){var c=a[s];0!==r[c]&&(n=!1)}n&&(i.splice(e--,1),t=o(o.s=a[0]))}return t}var n={},r={app:0},i=[];function o(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.e=function(t){var e,a=[],n=r[t];if(0!==n)if(n)a.push(n[2]);else{var i=new Promise((function(e,a){n=r[t]=[e,a]}));a.push(n[2]=i);var s,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=o.p+"js/"+({about:"about"}[e=t]||e)+"."+{about:"ad801997"}[e]+".js";var l=new Error;s=function(e){c.onerror=c.onload=null,clearTimeout(u);var a=r[t];if(0!==a){if(a){var n=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;l.message="Loading chunk "+t+" failed.\n("+n+": "+i+")",l.name="ChunkLoadError",l.type=n,l.request=i,a[1](l)}r[t]=void 0}};var u=setTimeout((function(){s({type:"timeout",target:c})}),12e4);c.onerror=c.onload=s,document.head.appendChild(c)}return Promise.all(a)},o.m=t,o.c=n,o.d=function(t,e,a){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(a,n,function(e){return t[e]}.bind(null,n));return a},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/static/",o.oe=function(t){throw console.error(t),t};var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var u=c;i.push([0,"chunk-vendors"]),a()}({0:function(t,e,a){t.exports=a("cd49")},"13a6":function(t,e,a){"use strict";var n=a("2082");a.n(n).a},"1b0b":function(t,e){t.exports="data:image/png;base64,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"},2082:function(t,e,a){},3213:function(t,e,a){},"5c0b":function(t,e,a){"use strict";var n=a("9c0c");a.n(n).a},"5f34":function(t,e,a){},"7b92":function(t,e,a){"use strict";var n=a("d4ec"),r=a("99de"),i=a("7e84"),o=a("262e"),s=a("9ab4"),c=a("60a3"),l=function(t){function e(){var t;return Object(n.a)(this,e),(t=Object(r.a)(this,Object(i.a)(e).apply(this,arguments))).RankList=[],t}return Object(o.a)(e,t),e}(c.c);Object(s.a)([Object(c.b)({default:[]})],l.prototype,"RankList",void 0);var u=l=Object(s.a)([c.a],l),h=(a("8635"),a("2877")),f=Object(h.a)(u,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"Rank"},[t.RankList&&0<t.RankList.length?a("div",[a("h1",[t._v(" RANK ")]),a("div",[a("table",{staticClass:"table"},[t._m(0),a("tbody",t._l(t.RankList,(function(e,n){return a("tr",{key:n},[a("td",{staticClass:"name"},[t._v(" "+t._s(e.UserName))]),a("td",[t._v(" "+t._s(e.Score))]),a("td",[t._v(" "+t._s(e.TouchCount))]),a("td",[t._v(" "+t._s((""+e.Score/e.TouchCount).substring(0,5)))])])})),0)])])]):t._e()])}),[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("thead",{staticClass:"thead-dark"},[a("tr",[a("th",[t._v("Name")]),a("th",[t._v("Score")]),a("th",[t._v("Touch")]),a("th",[t._v("Score/Touch")])])])}],!1,null,"1d864f57",null);e.a=f.exports},8635:function(t,e,a){"use strict";var n=a("f328");a.n(n).a},"90a0":function(t,e,a){"use strict";var n=a("3213");a.n(n).a},"9c0c":function(t,e,a){},c291:function(t,e,a){"use strict";var n=a("5f34");a.n(n).a},cd49:function(t,e,a){"use strict";a.r(e),a("e260"),a("e6cf"),a("cca6"),a("a79d");var n,r,i=a("2b0e"),o=(a("5c0b"),a("2877")),s=Object(o.a)({},(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view"),e("p"),e("h1",[this._v("SPONSOR")]),e("a",{attrs:{target:"_blank",href:"https://panty.run",alt:"탈알고",title:"탈알고"}},[e("img",{attrs:{src:a("1b0b")}})])],1)}),[],!1,null,null,null).exports,c=(a("d3b7"),a("8c4f")),l=(a("b0c0"),a("25f0"),a("d4ec")),u=a("bee2"),h=a("99de"),f=a("7e84"),m=a("262e"),p=a("9ab4"),v=a("7b92"),d=a("60a3"),b=a("bc3a"),g=a.n(b),k=(a("d81d"),a("96cf"),a("1da1"));function y(t){return new Promise((function(e){return setTimeout(e,t)}))}var x=function(){function t(){Object(l.a)(this,t),this.list=[]}return Object(u.a)(t,[{key:"enqueue",value:function(t){this.list.push(t)}},{key:"dequeue",value:function(){return this.list.shift()}},{key:"length",get:function(){return this.list.length}}]),t}(),O=function(){function t(){var e=this;Object(l.a)(this,t),this.proc=function(t){if(null!=n){var a,r,i=(a=t,r=n.getBoundingClientRect(),{x:a.clientX-r.left,y:a.clientY-r.top}),o=i.x,s=i.y,c=Math.floor(o/(e.BWIDTH+e.OUTLINE_PIXEL)),l=Math.floor(s/(e.BHEIGHT+e.OUTLINE_PIXEL));l>=e.maxBlockRow||c>=e.maxBlockColum||0!=e.map[l][c]&&(e.lastPos={y:l,x:c})}},this.score=0,this.touchcount=0,this.gameOver=!1,this.handleInit=!1,this.gameOverCallback=null,this.lastPos={y:-1,x:-1},this.displayScore=0,this.map=[[]],this.blockMax=3,this.maxBlockRow=15,this.maxBlockColum=8,this.BWIDTH=31,this.BHEIGHT=31,this.OUTLINE_PIXEL=0,this.MAPPXWIDTH=800,this.MAPPXHEIGHT=800,this.gameID=0,this.dropEffect=!0,this.deleteEffect=!0,this.colors=["(255, 255, 255)","(0, 171, 255)","(255, 171, 0)","(0, 255, 171)"]}var e,a;return Object(u.a)(t,[{key:"draw",value:function(){r.globalAlpha=1,r.fillStyle="rgb(0, 0, 0)",r.fillRect(0,0,this.MAPPXWIDTH,this.MAPPXHEIGHT),r.globalAlpha=1;for(var t=0;t<this.maxBlockRow;t++)for(var e=0;e<this.maxBlockColum;e++){var a=t*(this.BHEIGHT+this.OUTLINE_PIXEL),n=e*(this.BWIDTH+this.OUTLINE_PIXEL),i=this.colors[this.map[t][e]];r.fillStyle="rgb"+i,r.fillRect(n,a,this.BWIDTH,this.BHEIGHT)}}},{key:"newBlocks",value:function(){var t,e,a=0,n=0;for(a=0;a<this.maxBlockRow;a++)for(n=0;n<this.maxBlockColum;n++){if(0==a){if(0!=this.map[a][n])return this.gameOver=!0,void(null!=this.gameOverCallback&&this.gameOverCallback())}else this.map[a-1][n]=this.map[a][n];a==this.maxBlockRow-1&&(this.map[a][n]=(t=1,e=this.blockMax,Math.floor(Math.random()*(e-t+1))+t))}}},{key:"gameProcLoop",value:(a=Object(k.a)(regeneratorRuntime.mark((function t(e){var a,n,r,i,o,s;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=!1,t.next=3,y(100);case 3:if(this.gameOver||e!=this.gameID){t.next=32;break}return t.next=6,y(50);case 6:if(0<=this.lastPos.x&&0<=this.lastPos.y)return t.next=9,this.deleteblock({i:this.lastPos.y,j:this.lastPos.x},this.map[this.lastPos.y][this.lastPos.x],1);t.next=14;break;case 9:n=t.sent,this.touchcount+=1,this.score+=n*n,this.lastPos={y:-1,x:-1},a=!0;case 14:i=!(r=!1);case 16:if(!i){t.next=23;break}for(i=!1,o=this.maxBlockRow-1;0<o;o--)for(s=0;s<this.maxBlockColum;s++)0==this.map[o][s]&&0!=this.map[o-1][s]&&(this.map[o][s]=this.map[o-1][s],this.map[o-1][s]=0,i=r=!0);if(this.dropEffect)return t.abrupt("break",23);t.next=21;break;case 21:t.next=16;break;case 23:if(r&&this.draw(),a)return this.newBlocks(),a=!1,this.draw(),t.next=30,y(100);t.next=30;break;case 30:t.next=3;break;case 32:case"end":return t.stop()}}),t,this)}))),function(t){return a.apply(this,arguments)})},{key:"deleteblock",value:(e=Object(k.a)(regeneratorRuntime.mark((function t(e,a,n){var r,i,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=0,(i=new x).enqueue(e);case 4:if(!(0<i.length)){t.next=23;break}if(null==(o=i.dequeue()))return t.abrupt("break",23);t.next=8;break;case 8:if(0==this.map[o.i][o.j])return t.abrupt("continue",4);t.next=10;break;case 10:if(this.map[o.i][o.j]=0,r++,this.displayScore=this.score+r*r,this.deleteEffect)return this.draw(),t.next=17,y(25);t.next=17;break;case 17:0!=o.i&&this.map[o.i-1][o.j]==a&&i.enqueue({i:o.i-1,j:o.j}),o.j!=this.maxBlockColum-1&&this.map[o.i][o.j+1]==a&&i.enqueue({i:o.i,j:o.j+1}),o.i!=this.maxBlockRow-1&&this.map[o.i+1][o.j]==a&&i.enqueue({i:o.i+1,j:o.j}),0!=o.j&&this.map[o.i][o.j-1]==a&&i.enqueue({i:o.i,j:o.j-1}),t.next=4;break;case 23:return t.abrupt("return",new Promise((function(t){t(r)})));case 24:case"end":return t.stop()}}),t,this)}))),function(t,a,n){return e.apply(this,arguments)})},{key:"initMAP",value:function(){if(null!=(n=document.getElementById("cvs"))){for(var t=0;t<this.maxBlockRow;t++){void 0===this.map[t]&&(this.map[t]=[]);for(var e=0;e<this.maxBlockColum;e++)this.map[t][e]=0}if(0==this.handleInit){if(r=n.getContext("2d"),null==n)return;n.addEventListener("click",this.proc),r.globalAlpha=.2,r.fillStyle="rgb(0, 171, 255)",r.fillRect(0,0,this.MAPPXWIDTH,this.MAPPXHEIGHT),r.globalAlpha=1,this.handleInit=!0}this.newBlocks()}}},{key:"startGame",value:function(){this.initMAP(),this.score=0,this.displayScore=0,this.touchcount=0,this.draw(),this.gameOver=!1,this.gameID++,this.gameProcLoop(this.gameID)}}]),t}();function j(t){function e(t,e){var a=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(a>>16)<<16|65535&a}function a(t,e){return t>>>e|t<<32-e}function n(t,e){return t>>>e}return function(t){for(var e="0123456789abcdef",a="",n=0;n<4*t.length;n++)a+=e.charAt(t[n>>2]>>8*(3-n%4)+4&15)+e.charAt(t[n>>2]>>8*(3-n%4)&15);return a}(function(t,r){var i,o,s,c,l,u,h,f,m,p,v,d,b,g,k,y,x,O,j=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],P=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],R=new Array(64);t[r>>5]|=128<<24-r%32,t[15+(r+64>>9<<4)]=r;for(var S=0;S<t.length;S+=16){i=P[0],o=P[1],s=P[2],c=P[3],l=P[4],u=P[5],h=P[6],f=P[7];for(var w=0;w<64;w++)R[w]=w<16?t[w+S]:e(e(e(a(O=R[w-2],17)^a(O,19)^n(O,10),R[w-7]),a(x=R[w-15],7)^a(x,18)^n(x,3)),R[w-16]),m=e(e(e(e(f,a(y=l,6)^a(y,11)^a(y,25)),(k=l)&u^~k&h),j[w]),R[w]),p=e(a(g=i,2)^a(g,13)^a(g,22),(v=i)&(d=o)^v&(b=s)^d&b),f=h,h=u,u=l,l=e(c,m),c=s,s=o,o=i,i=e(m,p);P[0]=e(i,P[0]),P[1]=e(o,P[1]),P[2]=e(s,P[2]),P[3]=e(c,P[3]),P[4]=e(l,P[4]),P[5]=e(u,P[5]),P[6]=e(h,P[6]),P[7]=e(f,P[7])}return P}(function(t){for(var e=[],a=0;a<8*t.length;a+=8)e[a>>5]|=(255&t.charCodeAt(a/8))<<24-a%32;return e}(t=function(t){t=t.replace(/\r\n/g,"\n");for(var e="",a=0;a<t.length;a++){var n=t.charCodeAt(a);n<128?e+=String.fromCharCode(n):(127<n&&n<2048?e+=String.fromCharCode(n>>6|192):(e+=String.fromCharCode(n>>12|224),e+=String.fromCharCode(n>>6&63|128)),e+=String.fromCharCode(63&n|128))}return e}(t)),8*t.length))}a("ac1f"),a("5319");var P=new O,R=function(t){function e(){var t;return Object(l.a)(this,e),(t=Object(h.a)(this,Object(f.a)(e).apply(this,arguments))).game=P,t.gameStart=!1,t.name="",t.RankList=[],t}return Object(m.a)(e,t),Object(u.a)(e,[{key:"mounted",value:function(){this.game.gameOverCallback=this.gameOverCallback}},{key:"gameOverCallback",value:function(){var t=this;this.RankList=[],g.a.post("/api/poptilerank",{UserName:this.name,Score:this.game.score,TouchCount:this.game.touchcount,Check:j(this.name+(this.game.score+this.game.touchcount).toString())}).then((function(e){t.RankList=e.data.RankList}))}},{key:"startBtnHandle",value:function(){this.game.startGame(),this.gameStart=!0}},{key:"retryGame",value:function(){this.game.startGame()}}]),e}(d.c),S=R=Object(p.a)([Object(d.a)({name:"poptile",components:{Rank:v.a}})],R),w=(a("90a0"),Object(o.a)(S,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"poptile"},[a("b-form-checkbox",{attrs:{name:"check-button",switch:""},model:{value:t.game.dropEffect,callback:function(e){t.$set(t.game,"dropEffect",e)},expression:"game.dropEffect"}},[t._v(" 떨어짐 효과 ")]),a("b-form-checkbox",{attrs:{name:"check-button",switch:""},model:{value:t.game.deleteEffect,callback:function(e){t.$set(t.game,"deleteEffect",e)},expression:"game.deleteEffect"}},[t._v(" 지우는 효과 ")]),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.gameStart,expression:"!gameStart"}]},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"form-control username",attrs:{type:"text",placeholder:"사용자이름",maxlength:"30"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),a("p"),a("input",{staticClass:"btn btn-outline-primary",attrs:{type:"button",value:"START!"},on:{click:t.startBtnHandle}})]),a("div",{directives:[{name:"show",rawName:"v-show",value:t.gameStart,expression:"gameStart"}]},[a("h2",[0<t.name.length?a("span",[t._v(" ["+t._s(t.name)+"] ")]):a("span",[t._v(" "+t._s(t.name)+" ")]),t._v(" SCORE: "+t._s(t.game.displayScore)+" ")]),t.game.gameOver?a("div",[a("h1",[t._v(" GAME OVER ")]),a("h1",{staticClass:"retry",on:{click:t.retryGame}},[t._v(" RETRY? ")]),t._v(" "),a("br")]):t._e(),a("div",{directives:[{name:"show",rawName:"v-show",value:!t.game.gameOver,expression:"!game.gameOver"}]},[a("canvas",{attrs:{id:"cvs",width:"245px",height:"460px"}})])]),t.game.gameOver?a("hr"):t._e(),t.game.gameOver?a("Rank",{attrs:{RankList:t.RankList}}):t._e(),t.gameStart?t._e():a("div",{attrs:{id:"nav"}},[a("router-link",{staticClass:"btn btn-outline-info",attrs:{to:"/poptile/rank"}},[t._v("RANK")])],1)],1)}),[],!1,null,"0e241b01",null).exports),I=function(t){function e(){var t;return Object(l.a)(this,e),(t=Object(h.a)(this,Object(f.a)(e).apply(this,arguments))).showHint=!1,t}return Object(m.a)(e,t),Object(u.a)(e,[{key:"toggle",value:function(){this.showHint=!this.showHint}}]),e}(d.c),E=I=Object(p.a)([d.a],I),A=(a("c291"),Object(o.a)(E,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"help"},[a("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle",value:"collapse-1",expression:"'collapse-1'"}],attrs:{variant:"outline-info"}},[t._v("사용법")]),a("b-collapse",{attrs:{id:"collapse-1"}},[a("div",{staticClass:"help-text"},[a("p",[t._v("1. 타일이 최대 높이를 넘으면 게임이 종료됩니다.")]),a("p",[t._v(" 2. 타일을 선택하면 선택된 타일과 인접한 같은 색의 타일이 지워지고 타일이 아래에서 올라옵니다. ")]),a("p",[t._v("3. 이름을 입력하면 이름으로 점수가 등록됩니다.")])])]),a("br")],1)}),[],!1,null,"a84099b6",null).exports),C=function(t){function e(){return Object(l.a)(this,e),Object(h.a)(this,Object(f.a)(e).apply(this,arguments))}return Object(m.a)(e,t),e}(d.c),U=C=Object(p.a)([d.a],C),H=(a("13a6"),{name:"Home",components:{Poptile:w,Help:A,UpdateHistory:Object(o.a)(U,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"help"},[a("b-button",{directives:[{name:"b-toggle",rawName:"v-b-toggle",value:"collapse-2",expression:"'collapse-2'"}],attrs:{variant:"outline-info"}},[t._v("업데이트 히스토리")]),a("b-collapse",{attrs:{id:"collapse-2"}},[a("div",{staticClass:"text-update-log"},[a("h3",[t._v("ver 20.3.13.2")]),a("pre",[t._v("\t지우는 효과 BFS로 탐색방법 변경\n\t\t\t\t")]),a("h3",[t._v("ver 20.3.13.1")]),a("pre",[t._v("\tURI처리 버그 수정\n\t\t\t\t")]),a("h3",[t._v("ver 20.3.12.2")]),a("pre",[t._v("\tmac, ios에서 동작안되는 문제 재수정\n\t효과 비활성화 가능하도록 수정\n\t\t\t\t")]),a("h3",[t._v("ver 20.3.12.1")]),a("pre",[t._v("\t지워지는 효과 추가\n\tURI처리 버그 수정\n\t히스토리 추가\n\t문의는 이곳으로 :) https://open.kakao.com/o/g9F8Ym1b\n\t\t\t\t")])])])],1)}),[],!1,null,"46315010",null).exports}}),T=Object(o.a)(H,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"home"},[e("Help"),e("Poptile"),e("UpdateHistory")],1)}),[],!1,null,null,null).exports;i.default.use(c.a);var G=[{path:"/static/index.html",name:"Home",component:T},{path:"/poptile",name:"Home",component:T},{path:"/",name:"Home",component:T},{path:"/static/poptile",name:"Home"},{path:"/static/poptile/rank",name:"RankPage",component:function(){return a.e("about").then(a.bind(null,"17f1"))}},{path:"/poptile/rank",name:"RankPage",component:function(){return a.e("about").then(a.bind(null,"17f1"))}}],B=new c.a({mode:"history",base:"/static/",routes:G}),_=a("a7fe"),J=a.n(_),L=a("5f5b"),X=a("b1e0");a("f9e3"),a("2dd8"),i.default.use(J.a,g.a),i.default.config.productionTip=!0,i.default.use(L.a),i.default.use(X.a),new i.default({router:B,render:function(t){return t(s)}}).$mount("#app")},f328:function(t,e,a){}});