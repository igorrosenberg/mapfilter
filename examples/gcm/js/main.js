
// the google map object
var map;

// list calendars currently active. 
var calendarList = [];

// list of the events with information. 
var event_markers = new Set();

/*
 * Add google maps script if not there yet = async load gmaps
 */ 
function loadScript() {

	// calendarList = calendarList1;

	var callback='initialize'; // see also else block... 
	var g_id = 'google_maps';
	if ( ! document.getElementById(g_id) ) {
		var script = document.createElement('script');
		script.id = g_id;
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.10&sensor=false&callback=' + callback;
		document.body.appendChild(script);
	} else {
		initialize();
	}            

} // end loadScript

function initialize() {
	// document.getElementById('map_canvas').style.display = 'block' ;
	// document.getElementById('button').style.display = 'none' ;
	loadCalendars();
	info ('UNCOMMENT');
	// createMap();
	// addMarkersToMap();
} // end initialize


