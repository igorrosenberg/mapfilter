// the google map object, loaded asynch
var map;

// A map calId => list of the events 
var event_markers = {};

// Add google maps script if not there yet = async load gmaps
function loadScript(cal) {

	loadCalendars(cal);

	// async exec of this, calendar fetch is #1
	var g_id = 'google_maps';
	if ( ! document.getElementById(g_id) ) {
		var script = document.createElement('script');
		script.id = g_id;
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.10&sensor=false&callback=mapInitialized';
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
	
	// display map controls
	var elementsToShow = document.querySelectorAll(".onCalLoad");
	for (var i=0; i < elementsToShow.length; i++)
		 elementsToShow[i].style.display = 'block';	
	document.getElementById("no_map_yet").style.display = 'none';
	
} // end loadScript

