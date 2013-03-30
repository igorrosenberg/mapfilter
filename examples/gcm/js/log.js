
// -----------------------------------------
// make sure logs don't break the javascript
// -----------------------------------------
 var console = {};

if (!("console" in window)) {
 var names = "log,debug,info,warn,error,assert,dir,dirxml,group,groupEnd,time,timeEnd,count,trace,profile,profileEnd".split(",");
 window.console = {};
 for (var i = 0, len = names.length; i < len; i++) {
   //window.console[names[i]] = function(){};
   window.console[names[i]] = function(x) {htmlLog(x);};
 }
 console['log'] = function(x) {htmlLog(x);};
 window.console['log'] = function(x) {htmlLog(x);};
}

function htmlLog(text){
	var logs = document.getElementById("footer");
    var li = document.createElement('p');
    li.appendChild(document.createTextNode(text)); 
    logs.appendChild(li);
	}

	htmlLog("wpooo");
