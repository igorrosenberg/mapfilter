
function geocode(event){
	console.log("TODO variable 'event' is lost, push it somewhere!");
}
function createMarker(marker){
	// new Gmarker object
	var gMarker = new google.maps.Marker({
		position: new google.maps.LatLng(marker.lat, marker.lng),
		title: marker.desc,
		map: map,
		zIndex: 2,
		//  icon: image,
		});

		// add Listener that pops an infoWindow 
		google.maps.event.addListener(gMarker, 'click', function() {
			var infowindow = new google.maps.InfoWindow({content: marker.info});
			infowindow.open(map, gMarker);
		});
		return gMarker;
}  // end createMarker
  
function addMarkersToMap() {
	var values = event_markers.values();
	for (var i = 0; i < values.length; i++) {
		// remember marker so hiding is posible
		values[i].gMarker = createMarker(values[i]);
		} // end for markers
} // end addMarkersToMap

function hideMarkersFromMap() {
	var values = event_markers.values();
	for (var i = 0; i < values.length; i++) {
		var marker = values[i];
		console.log ('hiding marker ' + marker.title + ' at ' + marker.lat) ;
		marker.gMarker.setMap(null) ;
	} // end for markers
} // end addMarkersToMap

function createMap() {

	// only create map if it doesn't exist
	if (!map) {
		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(48.114767,-1.68251), // Rennes
			mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
     }

   } // end createMap

