
// ---------------------
// tracing events
// ---------------------
function showHideLog(){
	var div = document.getElementById("log");
	if (div.style.display == 'none'){
		div.style.display = 'block';
	}
	else {
		div.style.display = 'none';
	}
}

function info(string){
		var content = document.createElement('li');
		content.appendChild(document.createTextNode(string));
		document.getElementById("log_ul").appendChild(content);
}
		
// ----------------------------------
// make sure logs don't break the javascript
// ----------------------------------

if (!("console" in window)) {
 var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
 window.console = {};
 for (var i = 0, len = names.length; i < len; ++i) {
 window.console[names[i]] = function(){};
 }
}		
