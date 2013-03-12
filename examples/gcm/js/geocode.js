var geoCodeCalls = 0;

var googleGeocoder; 

var geocodeCacheUrl = 'http://igor.rosenberg.free.fr/gc/m/geo-cache/cache.php?address=';

function geocode(eventArray, callback) {	
	geoCodeCalls += eventArray.length;
 	for (var i = 0; i < eventArray.length; i++) {
		geocodeOneEvent(eventArray[i].addrOrig, callback);
		}
	// call to createMap=callback made in success
}


function geocodeGoogle(address, callback) {
	// loop on this function until google maps ready
	if (!mapScriptLoaded){
		console.log ('map script not yet ready ??');
		setTimeout(function(){geocodeGoogle(address, callback);}, 50);
		return;
	}
	if (! googleGeocoder )	
		googleGeocoder = new google.maps.Geocoder();

	// https://developers.google.com/maps/documentation/javascript/v2/services?hl=es#Geocoding_Object

	googleGeocoder.geocode({'address': address}, function(results, status){
		if (status != 'OK') {
			console.warn ("encodage GPS d'adresse impossible: " + status + ' pour ' + address);
			success (callback); 
		} else {
			var point = results[0].geometry.location;
			localCache[address] = {lat:point.lat();lng: point.lng()};
			success (callback); 
			}
	});
} // end geocodeGoogle

function success( callback ){
	geoCodeCalls--; 
	if (geoCodeCalls == 0) { 
		callback(); 
		}
         now see/delete addLatLong(event, point)
}
function addLatLong(event, point){
	event.lat = point.lat(); 
	event.lng = point.lng();
	event_markers.add(event);
}


function geocodeOneEvent(address, callback) {
	if (localCache[address] == null)
		geocodeCache(address, callback);
	else 
		success(callback);
}

function geocodeCache(address, callback) {
	var ajaxURL = geocodeCacheUrl + address;
	Par xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 info ('Cache response received, length=' + xmlhttp.responseText.length);
				 localCache[address] = parseCacheResponse(xmlhttp.responseText);
				success(callback);
			} else {
				console.warn ('Cache response failure... status=' + xmlhttp.status);
				geocodeGoogle(address, callback);
				 }
		 }
	  };

	xmlhttp.open("GET",ajaxURL,true);
	xmlhttp.send();
}

