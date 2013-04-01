
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
			console.log("geocode| CALLBACK");
			callback(); 
		}
      
	}
 	for (var i = 0; i < eventArray.length; i++) {
		geocodeOneEvent(eventArray[i].addrOrig, countCallback, i * cacheSleep);
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
	
	if (! googleGeocoder)
		googleGeocoder = new google.maps.Geocoder();

	// https://developers.google.com/maps/documentation/javascript/v2/services?hl=es#Geocoding_Object
	googleGeocoder.geocode({'address': address}, function(results, status){
		if (status != 'OK') {
			failGeoEncode(status, address);
		} else {
			var point = results[0].geometry.location;
			console.log ("ggle encode OK: " + point.lat() + "/" + point.lng());
			localCache[address] = {lat: point.lat(), lng: point.lng()};
			console.log ("Storing " + localCache[address] + " for " + address);
		}
		callback(); 
	});
} // end geocodeGoogle
			
			
function failGeoEncode(status, address) {
		// TODO insert here user notification 
		console.warn ("encodage GPS d'adresse impossible: " + status + ' pour ' + address);
}

function geocodeOneEvent(address, callback, timeOut) {
	if (localCache[address] == null)
		setTimeout(
			function(){ geocodeCache(address, callback); }, 
			timeOut);
	else 
		callback();
}

function geocodeCache(address, callback) {
	var ajaxURL = geocodeCacheUrl + encodeURIComponent(address);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				console.log ('Cache response received, length=' + xmlhttp.responseText.length);
				localCache[address] = JSON.parse(xmlhttp.responseText);
				callback();
			} else {
				console.warn ('Cache response failure... status=' + xmlhttp.status);
				geocodeGoogle(address, callback);
			}
		 }
	  };

	xmlhttp.open("GET",ajaxURL,true);
	xmlhttp.send();
}

