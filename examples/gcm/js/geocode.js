var geoCodeCalls = 0;

function geocode(eventArray){	
	for (var i = 0; i < eventArray.length; i++) {
		var event = eventArray[i];
		geocodeOneEvent(event);
		}
	// call to createMap made in geocodeOneEvent
}

function addLatLong(event, jsonText){
	var geocodeAnswer = JSON.parse(jsonText);
	if (geocodeAnswer.status != 'OK'){
		info ('   failed to geocode: ' + geocodeAnswer.status + ' for ' + event.addrOrig);	
		return;
	}
	info ('received geocoding data for: ' + event.addrOrig);
	var point = geocodeAnswer.results.geometry.location;
	event.lat = point.lat; 
	event.lng = point.lng; 

	// TODO Move this code to gmaps.js
	// also prepare the text for the marker... 	
	var dates; 
	if (event.dateStart == event.dateEnd ) {
		dates = 'Date: le ' + event.dateStart;
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

function geocodeOneEvent(event) {
	info ('geocoding event: ' + event.addrOrig);
	// https://developers.google.com/maps/documentation/geocoding/
	geoCodeObj = {
		'address': event.addrOrig,
		'sensor': false
		};

	var array = [];
	for (var key in geoCodeObj) {
 		array.push( key + '=' + geoCodeObj[key] ) ;
	}		
	var mapString = array.join("&");
	var geocodeUrl = 'http://maps.googleapis.com/maps/api/geocode/json?';
	var ajaxURL = geocodeUrl + mapString;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 info ('Geocode response received, length=' + xmlhttp.responseText.length);
				 addLatLong(event, xmlhttp.responseText);
			} else {
				 info ('Geocode response failure... status=' + xmlhttp.status);
			}
			geoCodeCalls--;
			if (geoCodeCalls == 0) {
			   createMap();
			}
		 }
	  };

	geoCodeCalls ++ ;
	xmlhttp.open("GET",ajaxURL,true);
	xmlhttp.send();
}

