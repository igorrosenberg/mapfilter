
function geocode(eventArray){
	
	for (var i = 0; i < eventArray.length; i++) {
		var event = eventArray[i];
      console.log("geocode 'event' of " + event.addrOrig);
		event.lat = 48.10 + i / 100; 
		event.lng = -1.62 + i / 25; 
		
		var dates; 
		if (event.dateStart == event.dateEnd ) {
			dates = 	'Date: le ' + event.dateStart;
		}
		else {
			dates = 'Dates: du ' + event.dateStart + ' au ' + event.dateEnd;  
		}

		event.full = '<h4>' + event.name + '</h4><ul>' +
			'<li>' + event.desc + '</li>' + 
			'<li>' + dates + '</li>' + 
			'<li>' + 'Adresse: ' + event.addrOrig + '</li>' + 
			'<li>' + 'Calendrier <a href="'+event.url+'">' + event.title + '</a>' + 
			'</li></ul>' ;
		event_markers.add(event);
	}

	console.log("call createMap / addMarkersToMap should be made else where");
	createMap();
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
		var infowindow = new google.maps.InfoWindow({content: marker.full});
		infowindow.open(map, gMarker);
	});
	return gMarker;
}  // end addSingleMarkerToMap
  
function addMarkersToMap(markerList) {
	console.log ('markerList '+markerList);
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
		setTimeout(createMap, 100);
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

function showMapControls() {
	var toHide = document.getElementById("no_map_yet");
	var toShow = document.getElementById("map_controls");
	toHide.style.display = 'none';
	toShow.style.display = 'block';
}

