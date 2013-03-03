
window.addEventListener("load", init, false);

function init() {
	var button = document.getElementById ("new_task_button");
	button.addEventListener("click", startAction, false);
	
	setTimeout(function() { 
  		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.10&sensor=false&callback=googleMapsLoaded';
		document.body.appendChild(script);
	}, 1);
	}            

// has the map loading script finished ?
var googleGeocoder;

function googleMapsLoaded() {	
	googleGeocoder = new google.maps.Geocoder();
}

function startAction(event) {
	console.log("start geocode");
	var password =  document.getElementById ("password").value;
	var nb_entries =  document.getElementById ("nb_entries").value;
	var geocode_poll_min_delay =  document.getElementById ("geocode_poll_min_delay").value;
	getPendingAdresses(password, nb_entries, geocode_poll_min_delay);
	event.preventDefault();
}

function getPendingAdresses(pass, limit, geocode_poll_min_delay){
	console.log("    " + limit + " " + geocode_poll_min_delay);
	var fetchUrl = 'update.php';
	var ajaxURL = fetchUrl + "?pass=" + pass + "&limit="  + limit;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 console.log ('response received (list of addresses to geocode), length=' + xmlhttp.responseText.length);
				 var addresses = parsePendingAdresses(xmlhttp.responseText);
				 geocode(adresses, geocode_poll_min_delay);
			} else {
				 console.log ('Pending addresses could not be fetched... status=' + xmlhttp.status);
			}
		 }
	  };
	xmlhttp.open('GET', ajaxURL, true);
	xmlhttp.send();
}

function parsePendingAdresses(responseText) {
	console.log ('Should now decode the json string: ' + responseText);
	var response = JSON.parse(responseText);
	var addressArray = []; 
	if (response.status === 'OK'){
		for (var answer in response.keys) {
			addressArray.push(response.keys[answer].address);
		}
	} else { 
		console.log ('Error when trying to get the addresses: ' + response.message);
	}	
	console.log ('Returning: ' + addressArray );
	return addressArray; 
}

function updateCache() {
	console.log("Need to call the cache service to write new geolocation data ");
}


function geocode(addresses, geocode_poll_min_delay) {
	if ( (!addresses) || addresses.length == 0 )
		return;
	var address = addresses.shift();
	console.log ('geocoding event: ' + address);
	googleGeocoder.geocode({'address': address}, function(results, status){
		console.log ('Geocode response received' + status);
		if (status != 'OK') {
			console.log ("encodage GPS d'adresse impossible: " + status + ' pour ' + address);
			return; 
			}
		pushLatLong(address, results[0].geometry.location);
	});
	setTimeout(function() { geocode(addresses, geocode_poll_min_delay); }, geocode_poll_min_delay); 
}


function pushLatLong(address, point) {
 	var lat = point.lat(); 
	var lng = point.lng();
	console.log ('received: address=' + address + ' google=' + lat + '/' + lng);
	console.log("call updateCache");
}

