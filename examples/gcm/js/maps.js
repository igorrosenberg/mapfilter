function myInfowindow(event) {
	var dates; 
	if (event.dateStart == event.dateEnd ) {
		dates = 'Date: le ' + event.dateStart;
	}
	else {
		dates = 'Dates: du ' + event.dateStart + ' au ' + event.dateEnd;  
	}

	var full = '<div class="infoWindow">' ;
	full += '<h4>' + event.name + '</h4><ul>' ;
	if (event.desc && event.desc !== "") {
		full += '<li>' + event.desc + '</li>';
	}
	full += '<li>' + dates + '</li>' + 
		 '<li>' + 'Adresse: ' + event.addrOrig + '</li>' + 
		 '<li>' + 'Calendrier <a href="'+event.url+'">' + event.title + '</a>' + 
		 '</li></ul>' ;
	full += '</div>';
	
	return new google.maps.InfoWindow({content: full});
}

function addSingleMarkerToMap(marker){
	// new Gmarker object

	// add Listener that pops an infoWindow 
	google.maps.event.addListener(gMarker, 'click', function() {
		myInfowindow(marker).open(map, gMarker);
	});
	return gMarker;
}  // end addSingleMarkerToMap
  
function addMarkersToMap(markerList, calId) {
	var bounds = map.getBounds();
	if (bounds == null || bounds == undefined){
		bounds = new google.maps.LatLngBounds();
	}	
	var values = markerList.values();
	for (var i = 0; i < values.length; i++)  {
		if (values[i].calId == calId) {
			// remember marker so hiding is possible
			var latLng = new google.maps.LatLng(values[i].lat, values[i].lng);
			bounds.extend(latLng);
			values[i].gMarker = new google.maps.Marker({
				position: latLng,
				title: values[i].name + '\n' + values[i].addrOrig,
				zIndex: 2, map: map,          // adds the marker to gmap called 'map'
			});		
			google.maps.event.addListener(values[i].gMarker, 'click', function() {
				myInfowindow(values[i]).open(map, values[i].gMarker);
			});
		} // end if-for markers
		}
	map.fitBounds(bounds);

} // end addMarkersToMap

function deleteCalendar(calId, li_node) {
	// remove from calendar list
	li_node.parentNode.removeChild(li_node);
	// remove markers from google maps
	var values = event_markers.values();
	for (var i = values.length - 1; i >= 0 ; i--) {
		var event = values[i];
		if (event.calId == calId) {
			event.gMarker.setMap(null) ;
			event_markers.remove(values[i]);
		}
	}
	// remove from table
	var tableElement = document.getElementById("event_table_body");
	var deleteElements = tableElement.getElementsByClassName('tr' + calId);
	for (var i=deleteElements.length -1; i >=0 ; i--) {	
		deleteElements[i].parentNode.removeChild(deleteElements[i]);
	}	

	// reset map bounds
	var bounds = new google.maps.LatLngBounds();
	var values = event_markers.values();
	for (var i = 0; i < values.length; i++)  {
			// remember marker so hiding is possible
			var latLng = new google.maps.LatLng(values[i].lat, values[i].lng);
			bounds.extend(latLng);
		}
	map.fitBounds(bounds);	
}

function hideShowCalendar(calId, li_node) {

	var tableElement = document.getElementById("event_table_body");
	var hideElements = tableElement.getElementsByClassName('tr' + calId);
	
	var targetMap;

	if (li_node.classList.contains('not-on-map') ) {
		li_node.classList.remove('not-on-map'); // display control link
		targetMap = map;				// add point to the only google map div on page
		for (var i=hideElements.length -1; i >=0 ; i--) {	// show on table
				hideElements[i].classList.remove('not-on-map');
		     }	
	} else {
		li_node.classList.add('not-on-map'); // italics for control link
		targetMap = null; 			// hide point from google map div map
		for (var i=hideElements.length -1; i >=0 ; i--) { // hide from table
			hideElements[i].classList.add('not-on-map');
	     }	
	}

	var values = event_markers.values();
	for (var i = 0; i < values.length; i++) {
		var event = values[i];
		if (event.calId == calId) {
			event.gMarker.setMap(targetMap) ;
		}
	} 
	
} // end hideShowCalendar

function createMap(calId) {
	// loop on this function until google maps ready
	if (!mapScriptLoaded){
		console.log ('map script not yet ready ??');
		setTimeout(function () { createMap(calId);} , 50);
	} else {
		// only create map if it doesn't exist
		if (!map) {
			var mapOptions = {
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var mapBlock = document.getElementById('map_canvas');
			map = new google.maps.Map(mapBlock, mapOptions);
		  }
		  
		addMarkersToMap(event_markers, calId);

	}
} // end createMap

// Insert in separate file
function populateTable (events) {

	// places the name in the show/hide list
 	var cal_list = document.getElementById("cal_list");
  	var node = document.createElement('li');
  	var calId = events[0].calId;
	appendJSLink(node, events[0].title, function() { hideShowCalendar(calId, node); });
  	node.appendChild(document.createTextNode(' ')); 
	appendJSLink(node, 'X', function() { deleteCalendar(calId, node); });
  	cal_list.appendChild(node);

	// inserts a table row
	var tableElement = document.getElementById("event_table_body");
	for (var i=0; i < events.length; i++) {
        	var tr = document.createElement('tr');
        	tr.className = 'tr' + calId;
        	// add color to table lines? content.class = css_classes;
        	appendTextChild(tr, 'td' , events[i].name);
        	appendTextChild(tr, 'td' , events[i].addrOrig);
        	appendTextChild(tr, 'td' , events[i].dateStart + ' ' + events[i].dateEnd);        	
        	tableElement.appendChild(tr);
        }
}

function appendTextChild(parent, nodeName, text){
        	var node = document.createElement(nodeName);
        	node.appendChild(document.createTextNode(text)); 
        	parent.appendChild(node);
}

function appendJSLink(parent, text, callback){
        	var node = document.createElement('a');
        	node.href = '#';
        	node.onclick = function () { callback(); return false;};
        	node.appendChild(document.createTextNode(text)); 
        	parent.appendChild(node);
}

