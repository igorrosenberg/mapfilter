
var geoCodeCalls = 0;
var cacheSleep = 50;
var googleGeocoder; 

var geocodeCacheUrl = 'http://igor.rosenberg.free.fr/gcm/geo-cache/cache.php?address=';

var localCache = {};

function geocode(eventArray, callback) {	
	geoCodeCalls += eventArray.length;

	var countCallback = function () {
		geoCodeCalls--; 
		if (geoCodeCalls == 0) { 
			console.log("   now see/delete addLatLong(event, point) " );
			callback(); 
		}
      
	}
 	for (var i = 0; i < eventArray.length; i++) {
		setTimeout(function(){ geocodeOneEvent(eventArray[i].addrOrig, countCallback); }, i * cacheSleep);
		}
	// call to createMap=callback made once remote call returns
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
			failGeoEncode(status, address);
		} else {
			var point = results[0].geometry.location;
			localCache[address] = {lat: point.lat(), lng: point.lng()};
		}
		callback(); 
	});
} // end geocodeGoogle
			
			
function failGeoEncode(status, address) {
		// TODO insert here user notification 
		console.warn ("encodage GPS d'adresse impossible: " + status + ' pour ' + address);
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
		callback();
}

function geocodeCache(address, callback) {
	var ajaxURL = geocodeCacheUrl + urlEncode(address);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				console.log ('Cache response received, length=' + xmlhttp.responseText.length);
				localCache[address] = JSON.parse(xmlhttp.responseText);
			} else {
				console.warn ('Cache response failure... status=' + xmlhttp.status);
				geocodeGoogle(address, callback);
			}
			callback();
		 }
	  };

	xmlhttp.open("GET",ajaxURL,true);
	xmlhttp.send();
}

