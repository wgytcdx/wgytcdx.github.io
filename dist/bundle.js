!function(e){var o={};function t(n){if(o[n])return o[n].exports;var l=o[n]={i:n,l:!1,exports:{}};return e[n].call(l.exports,l,l.exports,t),l.l=!0,l.exports}t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,o){if(1&o&&(e=t(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var l in e)t.d(n,l,function(o){return e[o]}.bind(null,l));return n},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},t.p="",t(t.s=0)}([function(e,o){!function(){$.goNavShow=function(e){const o=$(e);$(window).on("scroll",(function(e){e.preventDefault(),$(this).scrollTop()>=200?o.addClass("visible"):o.removeClass("visible")}))};const e=$("#nav-toggle"),o=$("nav ul");e.on("click",(function(e){e.preventDefault(),o.slideToggle(250),this.classList.toggle("active")})),$(window).resize(()=>{$(window).width()>320&&o.is(":hidden")&&o.removeAttr("style")}),$(".gotop-js").on("click",e=>{$("body").animate({scrollTop:0},"slow")});const t=$("li.last"),n=$("#modal"),l=$(".close"),i=$(".cover");t.on("click",e=>{$("body").addClass("remodal"),n.show()}),l.on("click",e=>{n.hide(),$("body").removeClass("remodal")}),i.on("click",()=>{n.hide(),$("body").removeClass("remodal")}),$(".hero a").on("click",e=>{e.preventDefault(),n.show(),$("body").addClass("remodal")}),$(".projects").on("mouseenter","article",(function(){$(this).siblings().addClass("dim")})).on("mouseleave","article",(function(){$(this).siblings().removeClass("dim")}))}(jQuery),$(()=>{const e=$("#Change").children(),o=e.length;let t=0,n=null;function l(t){for(let t=0;t<o-1;t++)e[t].style.zIndex=100-t,e[t].style.opacity="0";e[t].style.zIndex=100,e[t].style.opacity="1"}l(0),n=setInterval((function(){t%2==0&&(t=0),l(t),t++}),3e3),$.goNavShow($("#top-js")),$(".wodryRX").wodry(),$(".top_ul li").mouseover((function(){$(this).children("div").addClass("selected")})),$(".top_ul li").mouseout((function(){$(this).children("div").removeClass("selected")}))})}]);