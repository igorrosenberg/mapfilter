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

		populateTable(event_markers);
		
		showMapControls();
	}
} // end createMap

function showMapControls() {
	var toHide = document.getElementById("no_map_yet");
	var toShow = document.getElementById("map_controls");
	toHide.style.display = 'none';
	toShow.style.display = 'block';
}


// Insert in separate file
function populateTable (events) {
	var tableElement = document.getElementById("event_table_body");

	for (var i=0; i < events.length; i++) {
        	var content = document.createElement('tr');
        	// add color to table lines? content.class = css_classes;
        	var td1 = document.createElement('td'); td1.appendChild(document.createTextNode(events[i].name));  content.appendChild(td1);
        	var td2 = document.createElement('td'); td2.appendChild(document.createTextNode(events[i].addrOrig));  content.appendChild(td2);
        	var td3 = document.createElement('td');
        	td3.appendChild(document.createTextNode(events[i].dateStart + ' / ' + events[i].dateEnd)); 
        	content.appendChild(td3);
        	
        	tableElement.appendChild(content);
        }
        
}

