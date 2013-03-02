
window.addEventListener("load", init, false);

function init() {
	var button = document.getElementById ("new_task_button");
	button.addEventListener("click", startAction, false);
}

function startAction(event) {
	console.log("start geocode");
	var password =  document.getElementById ("password").value;
	var nb_entries =  document.getElementById ("nb_entries").value;
	var cache_update_delay =  document.getElementById ("cache_update_delay").value;
	var geocode_poll_min_delay =  document.getElementById ("geocode_poll_min_delay").value;

	getPendingAdresses(password, nb_entries, cache_update_delay, geocode_poll_min_delay, geocode);
	
	event.preventDefault();
}

function	getPendingAdresses(pass, limit, cache_update_delay, geocode_poll_min_delay, geocodeFunction){
	console.log("    " + nb_entries + " " + cache_update_delay + " " + geocode_poll_min_delay);
	console.log("Need to call the cache service to read new address data ");
	console.log("Then call geocode");
	console.log("Which will call updateCache");
	var fetchUrl = 'update.php';
	var ajaxURL = fetchUrl + "?pass=" + pass + "&limit="  + limit;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 info ('response received (list of addresses to geocode), length=' + xmlhttp.responseText.length);
				 parsePendingAdresses(xmlhttp.responseText, pass, cache_update_delay, geocode_poll_min_delay, geocodeFunction);
			} else {
				 info ('Pending addresses could not be fetched... status=' + xmlhttp.status);
			}
		 }
	  };
	xmlhttp.open('GET', ajaxURL, true);
	xmlhttp.send();
}

function parsePendingAdresses(responseText, pass, cache_update_delay, geocode_poll_min_delay, geocodeFunction){
	console.log ('Should now decode the json string: ' + responseText);
	var response = JSON.parse(responseText);
	if (response.status === 'OK'){
		console.log ('use this: ' + response);
	} else { 
		console.log ('Error when trying to get the addresses: ' + response.message);
	}
}

function	updateCache() {
	console.log("Need to call the cache service to write new geolocation data ");
}

