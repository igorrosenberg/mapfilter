
// -----------------------------------------
// make sure logs don't break the javascript
// -----------------------------------------

if (!("console" in window)) {
 var names = "log,debug,info,warn,error,assert,dir,dirxml,group,groupEnd,time,timeEnd,count,trace,profile,profileEnd".split(",");
 window.console = {};
 for (var i = 0, len = names.length; i < len; i++) {
   window.console[names[i]] = function(){};
 }
}

