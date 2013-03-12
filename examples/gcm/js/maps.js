function myInfowindow(event) {
	var dates; 
	if (event.dateStart == event.dateEnd ) {
		dates = 'Date: le ' + event.dateStart;
	}
	else {
		dates = 'Dates: du ' + event.dateStart + ' au ' + event.dateEnd;  
	}

	var full = '<h4>' + event.name + '</h4><ul>' ;
	if (event.desc && event.desc !== "") {
		full += '<li>' + event.desc + '</li>';
	}
	full += '<li>' + dates + '</li>' + 
		 '<li>' + 'Adresse: ' + event.addrOrig + '</li>' + 
		 '<li>' + 'Calendrier <a href="'+event.url+'">' + event.title + '</a>' + 
		 '</li></ul>' ;
	return new google.maps.InfoWindow({content: full});
}

function addSingleMarkerToMap(marker){
	// new Gmarker object
	var gMarker = new google.maps.Marker({
		position: new google.maps.LatLng(marker.lat, marker.lng),
		title: marker.name + '\n' + marker.addrOrig,
		map: map,          // adds the marker to gmap called 'map'
		zIndex: 2,
		//  icon: image,
	});

	// add Listener that pops an infoWindow 
	google.maps.event.addListener(gMarker, 'click', function() {
		myInfowindow(marker).open(map, gMarker);
	});
	return gMarker;
}  // end addSingleMarkerToMap
  
function addMarkersToMap(markerList) {
	// console.log ('markerList '+markerList);
	var values = markerList.values();
	for (var i = 0; i < values.length; i++) {
		// remember marker so hiding is posible
		values[i].gMarker = addSingleMarkerToMap(values[i]);
		} // end for markers
} // end addMarkersToMap

function deleteCalendar(cal_id, li_node) {
	li_node.parentNode.removeChild(li_node);
	var values = event_markers.values();
	for (var i = values.length - 1; i >= 0 ; i--) {
		var event = values[i];
		if (event.calId == cal_id) {
			console.log ('delete event ' + event.title + ' at ' + event.lat) ;
			event.gMarker.setMap(null) ;
			values.splice(i,1);
		}
	}
}

function hideShowCalendar(cal_id, li_node) {

	var tableElement = document.getElementById("event_table_body");
	var hideElements = tableElement.getElementsByClassName('tr' + cal_id);
	
	var targetMap;

	if (li_node.classList.contains('not-on-map') ) {
		li_node.classList.remove('not-on-map'); // display control link
		targetMap = map;				// add point to the only google map div on page
		for (var i=hideElements.length -1; i >=0 ; i--) {	// show on table
				hideElements[i].classList.remove('not-on-map');
		     }	
	} else {
		li_node.classList.add('not-on-map'); // italics for control link
		targetMap = null; 			// hide point from google map div map
		for (var i=hideElements.length -1; i >=0 ; i--) { // hide from table
			hideElements[i].classList.add('not-on-map');
	     }	
	}

	var values = event_markers.values();
	for (var i = 0; i < values.length; i++) {
		var event = values[i];
		if (event.calId == cal_id) {
			console.log ('set map ' + event.title + ' at ' + event.lat + ' to ' + targetMap) ;
			event.gMarker.setMap(targetMap) ;
		}
	} 
	
} // end hideShowCalendar

function createMap() {
	// loop on this function until google maps ready
	if (!mapScriptLoaded){
		console.log ('map script not yet ready ??');
		setTimeout(createMap, 50);
	} else {
		console.log ('event_markers exists, so use it to bound map ');
		// only create map if it doesn't exist
		if (!map) {
			var mapOptions = {
				zoom: 8,
				center: new google.maps.LatLng(48.114767,-1.68251), // Rennes
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var mapBlock = document.getElementById('map_canvas');
			map = new google.maps.Map(mapBlock, mapOptions);
		  }
		  
		addMarkersToMap(event_markers);

		showMapControls();
	}
} // end createMap

// FIXME move somewhere else?
function showMapControls() {
	document.getElementById("no_map_yet").style.display = 'none';
	document.getElementById("map_controls").style.display = 'block';
	
	// remove suggested calendars
	var parent = document.getElementById("cal_list");
	var nodes = parent.getElementsByTagName('li');
	for(var i=nodes.length-1; i>=0; i--) {
		if (nodes[i].className.match(/\btemp\b/)) {
			parent.removeChild(nodes[i]);
			}
	}

}


// Insert in separate file
function populateTable (events) {

	// places the name in the show/hide list
 	var cal_list = document.getElementById("cal_list");
  	var node = document.createElement('li');
  	var calId = events[0].calId;
	appendJSLink(node, events[0].title, function() { hideShowCalendar(calId, node); });
  	node.appendChild(document.createTextNode(' ')); 
	appendJSLink(node, 'X', function() { deleteCalendar(calId, node); });
  	cal_list.appendChild(node);

	// inserts a table row
	var tableElement = document.getElementById("event_table_body");
	for (var i=0; i < events.length; i++) {
        	var tr = document.createElement('tr');
        	tr.className = 'tr' + calId;
        	// add color to table lines? content.class = css_classes;
        	appendTextChild(tr, 'td' , events[i].name);
        	appendTextChild(tr, 'td' , events[i].addrOrig);
        	appendTextChild(tr, 'td' , events[i].dateStart + ' ' + events[i].dateEnd);        	
        	tableElement.appendChild(tr);
        }
       
}

function appendTextChild(parent, nodeName, text){
        	var node = document.createElement(nodeName);
        	node.appendChild(document.createTextNode(text)); 
        	parent.appendChild(node);
}

function appendJSLink(parent, text, callback){
        	var node = document.createElement('a');
        	node.href = '#';
        	node.onclick = function () { callback(); return false;};
        	node.appendChild(document.createTextNode(text)); 
        	parent.appendChild(node);
}

