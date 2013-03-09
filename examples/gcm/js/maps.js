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

function hideMarkersFromMap() {
	var values = event_markers.values();
	for (var i = 0; i < values.length; i++) {
		var marker = values[i];
		console.log ('hiding marker ' + marker.title + ' at ' + marker.lat) ;
		marker.gMarker.setMap(null) ;
	} // end for markers
} // end hideMarkersFromMap

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

	// also places the name in the show/hide list
 	var cal_list = document.getElementById("cal_list");
	appendTextChild(cal_list, 'li', events[0].title + " (X -)");

	var tableElement = document.getElementById("event_table_body");

	for (var i=0; i < events.length; i++) {
        	var content = document.createElement('tr');
        	// add color to table lines? content.class = css_classes;
        	appendTextChild(content, 'td' , events[i].name);
        	appendTextChild(content, 'td' , events[i].addrOrig);
        	appendTextChild(content, 'td' , events[i].dateStart + ' ' + events[i].dateEnd);        	
        	tableElement.appendChild(content);
        }
       
}

function appendTextChild(parent, nodeName, text){
        	var node = document.createElement(nodeName);
        	node.appendChild(document.createTextNode(text)); 
        	parent.appendChild(node);
}

