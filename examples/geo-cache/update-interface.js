
window.addEventListener("load", init, false);

function init() {
	var button = document.getElementById ("new_task_button");
	button.addEventListener("click", startAction, false);
	
	// async load google geocode functions
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

var latest_batch_id=0;

function createProgressDiv() {
  	var div = document.createElement('li');
	
	// or use div.setAttribute ('id', xxx);
	div.id = 'p' + (latest_batch_id++);
        
        div.appendChild(document.createTextNode('reading cache')); 
  	var detail = document.createElement('div');
  	detail.id = div.id + 'd';
  	div.appendChild(detail);
	div.onmouseover = "show("+detail.id+")";
	div.onmouseout = "hide("+detail.id+")";
	
	// use css for that
	detail.style="display:none;"
        
        document.getElementById("queue_ul").appendChild(div);

	return div.id;
	}

// generic, move to other js file
function show(id) {
   var element = document.getElementById(id);
   element.style.display = 'block';
   }
      
function hide() {
   var element = document.getElementById(id);
   element.style.display = 'none';
   }
   
function addProgress(type,id){
  	var block = document.createElement('span');
// or use div.setAttribute ('id', xxx);
  	span.class = type;
        document.getElementById(id).appendChild(block);
}

function removeProgress(parent_id){
        var parent = document.getElementById(parent_id);
        parent.removeChild(parent.firstChild);
}

function startAction(event) {
	console.log("start geocode " );
	var password =  document.getElementById ("password").value;
	var nb_entries =  document.getElementById ("nb_entries").value;
	var geocode_poll_min_delay =  document.getElementById ("geocode_poll_min_delay").value;
	var progressDivId = createProgressDiv();
	getPendingAdresses(password, nb_entries, geocode_poll_min_delay, progressDivId);
	event.preventDefault();
}

function getPendingAdresses(pass, limit, geocode_poll_min_delay, batch_id){
	console.log("    " + limit + " " + geocode_poll_min_delay);
	var fetchUrl = 'update.php';
	var ajaxURL = fetchUrl + "?pass=" + pass + "&limit="  + limit;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 console.log ('response received (list of addresses to geocode), length=' + xmlhttp.responseText.length);
				 var addresses = parsePendingAdresses(xmlhttp.responseText);
				 geocode(addresses, geocode_poll_min_delay, pass, batch_id);
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

// tail recursive => make as a for loop on array
function geocode(addresses, geocode_poll_min_delay, pass, batch_id) {
	if ( (!addresses) || addresses.length == 0 )
		return;
	var address = addresses.shift();
	console.log ('geocoding event: ' + address);
	googleGeocoder.geocode({'address': address}, function(results, status){
		console.log ('Geocode response received' + status);
		if (status == 'OK') {
			pushLatLong(address, results[0].geometry.location, pass, batch_id);
		} else {
			console.log ("encodage GPS d'adresse impossible: " + status + ' pour ' + address);
			if (status == 'OVER_QUERY_LIMIT') {
				var justOne = [address];
				var adjusted_delay = 5*geocode_poll_min_delay;
				setTimeout(function() { geocode(justOne, adjusted_delay, pass, batch_id); }, adjusted_delay);
			}
		}
	});
	setTimeout(function() { geocode(addresses, geocode_poll_min_delay, pass, batch_id); }, geocode_poll_min_delay); 
}


function pushLatLong(address, point, pass, log_id) {
 	var lat = point.lat(); 
	var lng = point.lng();
	console.log ('received: address=' + address + ' google=' + lat + '/' + lng);



	var fetchUrl = 'update.php';
	var ajaxURL = fetchUrl + "?pass=" + pass + "&address=" + address + "&latitude=" + lat + "&longitude=" + lng ;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				console.log ('pushed lat n long for ' + address + ' response ' + xmlhttp.responseText);
				report ('Cached: ' + address, 'ok');
			} else {
				console.log ('Cannot push lat n long:' + xmlhttp.status);
				report ('Not cached: ' + address, 'fail');
			}
		 }
	  };
	xmlhttp.open('GET', ajaxURL, true);
	xmlhttp.send();
}


function report(string, css_classes){
                var content = document.createElement('li');
                content.addClass(css_classes);
                content.appendChild(document.createTextNode(string)); 
                document.getElementById("queue_ul").appendChild(content);
}
