/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "js/" + ({"about":"about"}[chunkId]||chunkId) + "." + {"about":"50b201c6"}[chunkId] + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"chunk-vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cd49");


/***/ }),

/***/ "5c0b":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9c0c");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "8d61":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "9c0c":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "cd49":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__("e260");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
var es_promise = __webpack_require__("e6cf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.assign.js
var es_object_assign = __webpack_require__("cca6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.finally.js
var es_promise_finally = __webpack_require__("a79d");

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.runtime.esm.js
var vue_runtime_esm = __webpack_require__("2b0e");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"7cb38a20-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=57cf298c&
var Appvue_type_template_id_57cf298c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('router-view')],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/App.vue?vue&type=template&id=57cf298c&

// EXTERNAL MODULE: ./src/App.vue?vue&type=style&index=0&lang=scss&
var Appvue_type_style_index_0_lang_scss_ = __webpack_require__("5c0b");

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/App.vue

var script = {}



/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  script,
  Appvue_type_template_id_57cf298c_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var App = (component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/vue-router/dist/vue-router.esm.js
var vue_router_esm = __webpack_require__("8c4f");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"7cb38a20-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Home.vue?vue&type=template&id=3fe64f4c&
var Homevue_type_template_id_3fe64f4c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"home"},[_c('poptile')],1)}
var Homevue_type_template_id_3fe64f4c_staticRenderFns = []


// CONCATENATED MODULE: ./src/views/Home.vue?vue&type=template&id=3fe64f4c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"7cb38a20-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/poptile.vue?vue&type=template&id=71febb3a&scoped=true&
var poptilevue_type_template_id_71febb3a_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"poptile"},[_c('h2',[_vm._v("SCORE : "+_vm._s(_vm.game.score))]),(_vm.game.gameOver)?_c('div',[_c('h1',[_vm._v(" GAME OVER ")]),_c('h1',{staticClass:"retry",on:{"click":_vm.retryGame}},[_vm._v(" RETRY? ")])]):_vm._e(),_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.game.gameOver),expression:"!game.gameOver"}]},[_c('canvas',{attrs:{"id":"cvs","width":"245px","height":"460px"}})])])}
var poptilevue_type_template_id_71febb3a_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/poptile.vue?vue&type=template&id=71febb3a&scoped=true&

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__("d4ec");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__("bee2");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js + 2 modules
var possibleConstructorReturn = __webpack_require__("99de");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
var getPrototypeOf = __webpack_require__("7e84");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js + 1 modules
var inherits = __webpack_require__("262e");

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__("9ab4");

// EXTERNAL MODULE: ./node_modules/vue-property-decorator/lib/vue-property-decorator.js + 1 modules
var vue_property_decorator = __webpack_require__("60a3");

// CONCATENATED MODULE: ./src/poptile.ts


var colors = ["(255, 255, 255)", "(0, 171, 255)", "(255, 171, 0)", "(0, 255, 171) "];
var BLCOKCOLORMAX = 3;
var cvs; //canvas

var ctx; //canvas 2d

var MAP = {};
var MAPX = 8; //max map width

var MAPY = 15; //max map height

var BWIDTH = 30; //block width 

var BHEIGHT = 30; //block height 

var MAPPXWIDTH = 800; //canvas widlth

var MAPPXHEIGHT = 800; //canvas heightㅁ

function randInt(min, max) {
  var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function draw() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, MAPPXWIDTH, MAPPXHEIGHT);
  ctx.globalAlpha = 1;

  for (var i = 0; i < MAPY; i++) {
    for (var j = 0; j < MAPX; j++) {
      var ypos = i * (BHEIGHT + 1);
      var xpos = j * (BWIDTH + 1);
      ctx.fillStyle = "rgb" + colors[MAP[i][j]];
      ctx.fillRect(xpos, ypos, BWIDTH, BHEIGHT); //  console.log(xpos, ypos, BWIDTH, BHEIGHT)
    }
  }
}

function dropBlocks() {
  var isDown = true;

  while (isDown) {
    isDown = false;

    for (var i = MAPY - 1; i > 0; i--) {
      for (var j = 0; j < MAPX; j++) {
        if (MAP[i][j] == 0 && MAP[i - 1][j] != 0) {
          MAP[i][j] = MAP[i - 1][j];
          MAP[i - 1][j] = 0;
          isDown = true;
        }
      }
    }
  }
}

var poptile_Game =
/*#__PURE__*/
function () {
  function Game() {
    var _this = this;

    Object(classCallCheck["a" /* default */])(this, Game);

    this.proc = function (e) {
      if (cvs == null) {
        return;
      }

      var pos = getMousePos(cvs, e);
      var xpos = pos.x;
      var ypos = pos.y;
      var j = Math.floor(xpos / (BWIDTH + 1));
      var i = Math.floor(ypos / (BHEIGHT + 1));

      if (i >= MAPY || j >= MAPX) {
        // console.log("big!", i, j)
        return;
      }

      if (MAP[i][j] == 0) {
        // 빈 타일
        return;
      } else {
        var count = _this.deleteblock({
          "i": i,
          "j": j
        }, MAP[i][j], 1);

        _this.score += (count * count + count) / 2; //점수 계산 식

        draw();
        dropBlocks();
      }

      _this.newBlocks();

      draw();
    };

    this.score = 0;
    this.gameOver = false;
    this.handleInit = false;
  }

  Object(createClass["a" /* default */])(Game, [{
    key: "newBlocks",
    value: function newBlocks() {
      var i = 0;
      var j = 0;

      for (i = 0; i < MAPY; i++) {
        for (j = 0; j < MAPX; j++) {
          if (i == 0) {
            if (MAP[i][j] != 0) {
              //end
              // console.log("end!!!")
              this.gameOver = true; // this.startGame()

              return;
            }
          } else {
            MAP[i - 1][j] = MAP[i][j];
          }

          if (i == MAPY - 1) {
            MAP[i][j] = randInt(1, BLCOKCOLORMAX);
          }
        }
      }
    }
  }, {
    key: "deleteblock",
    value: function deleteblock(pos, blockCode, depth) {
      var count = 1;
      var nextpos = {
        "i": 0,
        "j": 0
      };
      MAP[pos.i][pos.j] = 0; // console.log("delete block", pos.i, pos.j, blockCode)
      // console.log(MAP)
      //up

      if (pos.i != 0 && MAP[pos.i - 1][pos.j] == blockCode) {
        nextpos.i = pos.i - 1;
        nextpos.j = pos.j;
        count += this.deleteblock(nextpos, blockCode, depth + 1);
      } //right


      if (pos.j != MAPX - 1 && MAP[pos.i][pos.j + 1] == blockCode) {
        nextpos.i = pos.i;
        nextpos.j = pos.j + 1;
        count += this.deleteblock(nextpos, blockCode, depth + 1);
      } //down


      if (pos.i != MAPY - 1 && MAP[pos.i + 1][pos.j] == blockCode) {
        nextpos.i = pos.i + 1;
        nextpos.j = pos.j;
        count += this.deleteblock(nextpos, blockCode, depth + 1);
      } //left


      if (pos.j != 0 && MAP[pos.i][pos.j - 1] == blockCode) {
        nextpos.i = pos.i;
        nextpos.j = pos.j - 1;
        count += this.deleteblock(nextpos, blockCode, depth + 1);
      }

      return count;
    }
  }, {
    key: "initMAP",
    value: function initMAP() {
      cvs = document.getElementById('cvs');

      if (cvs == null) {
        return;
      }

      for (var i = 0; i < MAPY; i++) {
        if (typeof MAP[i] == "undefined") MAP[i] = {};

        for (var j = 0; j < MAPX; j++) {
          MAP[i][j] = 0;
        }
      }

      if (this.handleInit == false) {
        ctx = cvs.getContext('2d');

        if (cvs == null) {
          return;
        }

        cvs.addEventListener("click", this.proc);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'rgb(0, 171, 255)';
        ctx.fillRect(0, 0, MAPPXWIDTH, MAPPXHEIGHT);
        ctx.globalAlpha = 1;
        this.handleInit = true;
      } // console.log(MAP)


      this.newBlocks();
    }
  }, {
    key: "startGame",
    value: function startGame() {
      this.initMAP();
      this.score = 0;
      this.gameOver = false;
      draw();
    }
  }]);

  return Game;
}(); // $(document).ready(function () {
// 	console.log("MAP INIT")
//  initMAP();
// 	draw();
// })
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--14-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--14-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/poptile.vue?vue&type=script&lang=ts&









var poptilevue_type_script_lang_ts_Poptile =
/*#__PURE__*/
function (_Vue) {
  Object(inherits["a" /* default */])(Poptile, _Vue);

  function Poptile() {
    var _this;

    Object(classCallCheck["a" /* default */])(this, Poptile);

    _this = Object(possibleConstructorReturn["a" /* default */])(this, Object(getPrototypeOf["a" /* default */])(Poptile).apply(this, arguments));
    _this.game = new poptile_Game();
    return _this;
  }

  Object(createClass["a" /* default */])(Poptile, [{
    key: "mounted",
    value: function mounted() {
      console.log("mount!!!!");
      alert("????");
      this.game.startGame();
    }
  }, {
    key: "retryGame",
    value: function retryGame() {
      this.game.startGame();
    }
  }]);

  return Poptile;
}(vue_property_decorator["b" /* Vue */]);

poptilevue_type_script_lang_ts_Poptile = Object(tslib_es6["a" /* __decorate */])([vue_property_decorator["a" /* Component */]], poptilevue_type_script_lang_ts_Poptile);
/* harmony default export */ var poptilevue_type_script_lang_ts_ = (poptilevue_type_script_lang_ts_Poptile);
// CONCATENATED MODULE: ./src/components/poptile.vue?vue&type=script&lang=ts&
 /* harmony default export */ var components_poptilevue_type_script_lang_ts_ = (poptilevue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/components/poptile.vue?vue&type=style&index=0&id=71febb3a&scoped=true&lang=scss&
var poptilevue_type_style_index_0_id_71febb3a_scoped_true_lang_scss_ = __webpack_require__("d55d");

// CONCATENATED MODULE: ./src/components/poptile.vue






/* normalize component */

var poptile_component = Object(componentNormalizer["a" /* default */])(
  components_poptilevue_type_script_lang_ts_,
  poptilevue_type_template_id_71febb3a_scoped_true_render,
  poptilevue_type_template_id_71febb3a_scoped_true_staticRenderFns,
  false,
  null,
  "71febb3a",
  null
  
)

/* harmony default export */ var poptile = (poptile_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Home.vue?vue&type=script&lang=js&
//
//
//
//
//
//
// @ is an alias to /src

/* harmony default export */ var Homevue_type_script_lang_js_ = ({
  name: 'Home',
  components: {
    poptile: poptile
  }
});
// CONCATENATED MODULE: ./src/views/Home.vue?vue&type=script&lang=js&
 /* harmony default export */ var views_Homevue_type_script_lang_js_ = (Homevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/views/Home.vue





/* normalize component */

var Home_component = Object(componentNormalizer["a" /* default */])(
  views_Homevue_type_script_lang_js_,
  Homevue_type_template_id_3fe64f4c_render,
  Homevue_type_template_id_3fe64f4c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Home = (Home_component.exports);
// CONCATENATED MODULE: ./src/router/index.ts




vue_runtime_esm["a" /* default */].use(vue_router_esm["a" /* default */]);
var routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: function component() {
    return __webpack_require__.e(/* import() | about */ "about").then(__webpack_require__.bind(null, "f820"));
  }
}];
var router = new vue_router_esm["a" /* default */]({
  mode: 'history',
  base: "",
  routes: routes
});
/* harmony default export */ var src_router = (router);
// CONCATENATED MODULE: ./src/main.ts







vue_runtime_esm["a" /* default */].config.productionTip = true;
new vue_runtime_esm["a" /* default */]({
  router: src_router,
  render: function render(h) {
    return h(App);
  }
}).$mount('#app');

/***/ }),

/***/ "d55d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_poptile_vue_vue_type_style_index_0_id_71febb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8d61");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_poptile_vue_vue_type_style_index_0_id_71febb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_poptile_vue_vue_type_style_index_0_id_71febb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_poptile_vue_vue_type_style_index_0_id_71febb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ })

/******/ });
//# sourceMappingURL=app.37ca07c8.js.map