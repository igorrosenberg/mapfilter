
// the google map object
var map;

// list calendars currently active. 
var calendarList = [];

// list of the events with information. 
var event_markers = new Set();

// has the map loading script finished ?
var mapScriptLoaded = false;

/*
 * Add google maps script if not there yet = async load gmaps
 */ 
function loadScript(cal) {

	// calendarList = calendarList1;
	
	var g_id = 'google_maps';
	if ( ! document.getElementById(g_id) ) {
		var script = document.createElement('script');
		script.id = g_id;
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.10&sensor=false&callback=initialize';
		document.body.appendChild(script);
	}            
	
	// remove suggested calendars ("temp")
	var parent = document.getElementById("cal_list");
	var nodes = parent.getElementsByTagName('li');
	for(var i=nodes.length-1; i>=0; i--) {
		if (nodes[i].className.match(/\btemp\b/)) {
			parent.removeChild(nodes[i]);
			}
	}
	document.getElementById("no_map_yet").style.display = 'none';
	document.getElementById("map_controls").style.display = 'block';	

	loadCalendars(cal);

} // end loadScript

function initialize() {
	mapScriptLoaded = true;
} // end initialize

