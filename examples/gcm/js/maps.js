function mapInitialized() {
	var mapOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP };
	var mapBlock = document.getElementById('map_canvas');
	map = new google.maps.Map(mapBlock, mapOptions);
}

function addGmapListener(event){
	var dates; 
	if (event.dateStart == event.dateEnd ) {
		dates = 'Date: le ' + event.dateStart;
	}
	else {
		dates = 'Dates: du ' + event.dateStart + ' au ' + event.dateEnd;  
	}

	var full = '<div class="infoWindow">' ;
	full += '<h4>' + event.name + '</h4><ul>' ;
	if (event.desc && event.desc.trim() !== "") {
		full += '<li>' + event.desc + '</li>';
	}
	full += '<li>' + dates + '</li>' + 
		 '<li>' + 'Adresse: ' + event.addrOrig + '</li>' + 
		 '<li>' + 'Calendrier <a href="'+event.url+'">' + event.title + '</a>' + 
		 '</li></ul>' ;
	full += '</div>';
	
	var infowindow = new google.maps.InfoWindow({content: full});
	google.maps.event.addListener(event.gMarker, 'click', function() {
			infowindow.open(map, event.gMarker);
	});
}

function createMap(eventList) {
	// loop on this function until google maps ready
	if (!map){
		console.log ('map script not yet ready ??');
		setTimeout(function () { createMap(eventList);} , 50);
		return;
	}
	console.log ("createMap");
	for (var i = 0; i < eventList.length; i++)  {
		// how do we know where is the GPS cache data (localCache var)?
		console.log ("Looking for " + eventList[i].addrOrig);
		var point = localCache[eventList[i].addrOrig];
		if (point) {
			var latLng = new google.maps.LatLng(point.lat, point.lng);
			// remember marker so hiding is possible
			eventList[i].gMarker = new google.maps.Marker({
				position: latLng,
				title: eventList[i].name + '\n' + eventList[i].addrOrig,
				zIndex: 2, 
				map: map          // adds the marker to gmap called 'map'
			});		
			addGmapListener(eventList[i]);
		} else {
			console.warn ('no GPS data for '+ eventList[i].addrOrig);
		}
	}
	incrementBounds(eventList, map.getBounds());
} // end createMap

function incrementBounds(eventList, bounds){
	if (bounds == null || bounds == undefined){
		bounds = new google.maps.LatLngBounds();
	}	
	for (var i = 0; i < eventList.length; i++)  {
		if (eventList[i].gMarker) {
			bounds.extend( eventList[i].gMarker.getPosition() );
		}
	}
	map.fitBounds(bounds);
}

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
	incrementBounds(event_markers.values(), null);
}

// applies to map and table, separate?
function hideShowCalendar(calId, li_node) {

	var tableElement = document.getElementById("event_table_body");
	var hideElements = tableElement.getElementsByClassName('tr' + calId);
	
	var targetMap;

	if (li_node.classList.contains('not-on-map') ) {
		targetMap = map;				// add points to the only google map div on page
		li_node.classList.remove('not-on-map'); // normal font for control link
		for (var i=hideElements.length -1; i >=0 ; i--) {	// show on table
				hideElements[i].classList.remove('not-on-map');
		     }	
	} else {
		targetMap = null; 			// hide points from google map div map
		li_node.classList.add('not-on-map'); // italics for control link
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

// TODO Insert in separate file
function populateTable (events) {
	if (events.length == 0)
		return;
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

