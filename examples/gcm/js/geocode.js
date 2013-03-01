var geoCodeCalls = 0;

var googleGeocoder ; 

function geocode(eventArray, callback) {	
	// loop on this function until google maps ready
	if (!mapScriptLoaded){
		console.log ('map script not yet ready ??');
		setTimeout(function(){geocode(eventArray, callback);}, 50);
		return;
	}
	if (! googleGeocoder )	
		googleGeocoder = new google.maps.Geocoder();

	for (var i = 0; i < eventArray.length; i++) {
		var event = eventArray[i];
		geocodeOneEvent(event, callback);
		}
	// call to createMap made in geocodeOneEvent
}

function addLatLong(event, point){
	event.lat = point.lat(); 
	event.lng = point.lng();
	event_markers.add(event);
}

function geocodeOneEvent(event, callback) {
	info ('geocoding event: ' + event.addrOrig);
	geoCodeCalls ++ ;
	// https://developers.google.com/maps/documentation/javascript/v2/services?hl=es#Geocoding_Object

	googleGeocoder.geocode({'address': event.addrOrig}, function(results, status){
		geoCodeCalls--;
		if (status != 'OK') {
			info ("encodage GPS d'adresse impossible: " + status + ' pour ' + event.addrOrig);
			return; 
			}
		var point = results[0].geometry.location;
		addLatLong(event, point); 

		if (geoCodeCalls == 0) {
		   callback();
		}
	});
} // end geocodeOneEvent

